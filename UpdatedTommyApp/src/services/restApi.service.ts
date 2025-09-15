import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AlertasService } from './alertas.service';
import { ConnectionStatus, NetworkService } from './network.service';
import { StorageService } from './storage.service';

import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({ providedIn: 'root' })
export class RestApiService {

  private api: string;
  private apiPublic: string;

  constructor(
    private navController: NavController,
    private http: HttpClient,
    private networkService: NetworkService,
    private alertasService: AlertasService,
    private storageService: StorageService
  ) {
    this.api = environment.host + 'api/v2/';
    this.apiPublic = environment.host + 'apiPublic/v2/';
  }

  getHttpHeadersBasic() {
    return new HttpHeaders()
      .set('Authorization', 'Basic ' + btoa(environment.appC + ':' + environment.appS))
      .set('Content-Type', 'application/x-www-form-urlencoded');
  }

  getHttpHeadersToken(): Promise<HttpHeaders | null> {
    return new Promise(resolve => {
      this.storageService.getItem('token').then(token => {
        if (token != null) {
          resolve(new HttpHeaders().set('Authorization', 'Bearer ' + token).append('Content-Type', 'application/json'));
        } else {
          resolve(new HttpHeaders().append('Content-Type', 'application/json'));
        }
      }).catch(() => resolve(null));
    });
  }

  getHttpHeadersOnlyToken(): Promise<HttpHeaders | null> {
    return new Promise(resolve => {
      this.storageService.getItem('token').then(token => {
        if (token != null) {
          resolve(new HttpHeaders().set('Authorization', 'Bearer ' + token));
        } else {
          resolve(new HttpHeaders());
        }
      }).catch(() => resolve(null));
    });
  }

  getHttpHeadersOnlyTokenParam(token: string | null): Promise<HttpHeaders> {
    return new Promise(resolve => {
      if (token) resolve(new HttpHeaders().set('Authorization', 'Bearer ' + token));
      else resolve(new HttpHeaders());
    });
  }

  postApi(url: string, data: any) {
    return new Promise(resolve => {
      if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
        this.getHttpHeadersToken().then((headers: HttpHeaders | null) => {
          if (headers) {
            this.http.post(this.api + url, data, { headers })
              .subscribe(resp => resolve(resp),
                () => resolve({ exitoso: false, mensaje: '' }));
          } else {
            resolve({ exitoso: false, mensaje: 'Error al obtener los headers!' });
          }
        });
      } else {
        resolve({ exitoso: false, mensaje: 'No existe conexion!' });
      }
    });
  }

  postApiPublic(url: string, data: any) {
    return new Promise(resolve => {
      if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
        this.http.post(this.apiPublic + url, data)
          .subscribe(resp => resolve(resp),
            () => resolve({ exitoso: false, mensaje: '' }));
      } else {
        resolve({ exitoso: false, mensaje: 'No existe conexion!' });
      }
    });
  }

  postFileApi(url: string, data: any) {
    return new Promise(resolve => {
      if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
        this.getHttpHeadersOnlyToken().then((headers: HttpHeaders | null) => {
          if (headers) {
            this.http.post(this.api + url, data, { headers })
              .subscribe(resp => resolve(resp),
                () => resolve({ exitoso: false, mensaje: '' }));
          } else {
            resolve({ exitoso: false, mensaje: 'Error al obtener los headers!' });
          }
        });
      } else {
        resolve({ exitoso: false, mensaje: 'No existe conexion!' });
      }
    });
  }

  /**
   * POST que devuelve Blob y lo guarda en sandbox (Directory.Data)
   * @param url endpoint relativo (p.ej. 'docs/descargar')
   * @param localUrl (no se usa con Capacitor; se mantiene por compatibilidad)
   * @param data body; debe incluir {nombre} para usar como filename
   */
  getFileApi(url: string, localUrl: string, data: any) {
    return new Promise(resolve => {
      if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
        this.getHttpHeadersToken().then((headers: HttpHeaders | null) => {
          if (!headers) return resolve({ exitoso: false, mensaje: 'Error al obtener los headers!' });

          this.http.post(this.api + url, data, { headers, responseType: 'blob' })
            .subscribe(async (fileBlob: Blob) => {
              try {
                const fileName = (data?.nombre as string) || this.extraerNombre(localUrl) || 'archivo.bin';
                const uri = await this.writeBlobToDataDir(fileName, fileBlob);
                resolve({ exitoso: true, mensaje: '', archivo: { uri } });
              } catch {
                resolve({ exitoso: false, mensaje: '' });
              }
            }, () => resolve({ exitoso: false, mensaje: '' }));
        });
      } else {
        resolve({ exitoso: false, mensaje: 'No existe conexion!' });
      }
    });
  }

  downloadFile(urlFile: string, localUrl: string) {
    return new Promise(resolve => {
      if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
        fetch(urlFile)
          .then(async resp => {
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const blob = await resp.blob();

            const fileName = this.extraerNombre(localUrl) || this.extraerNombre(urlFile) || 'archivo.bin';
            const uri = await this.writeBlobToDataDir(fileName, blob);

            resolve({ exitoso: true, mensaje: '', archivo: { uri } });
          })
          .catch(() => resolve({ exitoso: false, mensaje: '' }));
      } else {
        resolve({ exitoso: false, mensaje: 'No existe conexion!' });
      }
    });
  }

  registrar(data: { correo: string; password: string; }) {
    return new Promise(resolve => {
      if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
        const params = new HttpParams()
          .set('correo', data.correo)
          .set('password', data.password);

        this.http.post(this.apiPublic + 'registrar/nuevoUsuario', params, { headers: this.getHttpHeadersBasic() })
          .subscribe((respuesta: any) => {
            if (respuesta.exitoso) resolve(respuesta);
            else resolve({ exitoso: false, mensaje: respuesta.mensaje });
          }, error => {
            if (error.status === 400) resolve({ exitoso: false, status: error.status, mensaje: 'Credenciales inválidas!' });
            else if (error.status === 0) resolve({ exitoso: false, status: error.status, mensaje: 'No existe comunicación con el servidor!' });
            else resolve(error);
          });
      } else {
        resolve({ exitoso: false, status: 0, mensaje: 'No existe conexion!' });
      }
    });
  }

  confirmar(data: { correo: string; codigo: string; }) {
    return new Promise(resolve => {
      if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
        const params = new HttpParams()
          .set('correo', data.correo)
          .set('codigo', data.codigo);

        this.http.post(this.apiPublic + 'registrar/confirmarCodigo', params, { headers: this.getHttpHeadersBasic() })
          .subscribe((respuesta: any) => {
            if (respuesta.exitoso) resolve(respuesta);
            else resolve({ exitoso: false, mensaje: respuesta.mensaje });
          }, error => {
            if (error.status === 400) resolve({ exitoso: false, status: error.status, mensaje: 'Credenciales inválidas!' });
            else if (error.status === 0) resolve({ exitoso: false, status: error.status, mensaje: 'No existe comunicación con el servidor!' });
            else resolve(error);
          });
      } else {
        resolve({ exitoso: false, status: 0, mensaje: 'No existe conexion!' });
      }
    });
  }

  solicitarContrasenia(data: { correo: string }) {
    return new Promise(resolve => {
      if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
        const params = new HttpParams().set('correo', data.correo);

        this.http.post(this.apiPublic + 'registrar/solicitarContrasenia', params, { headers: this.getHttpHeadersBasic() })
          .subscribe((respuesta: any) => {
            if (respuesta.exitoso) resolve(respuesta);
            else resolve({ exitoso: false, mensaje: respuesta.mensaje });
          }, error => {
            if (error.status === 400) resolve({ exitoso: false, status: error.status, mensaje: 'Credenciales inválidas!' });
            else if (error.status === 0) resolve({ exitoso: false, status: error.status, mensaje: 'No existe comunicación con el servidor!' });
            else resolve(error);
          });
      } else {
        resolve({ exitoso: false, status: 0, mensaje: 'No existe conexion!' });
      }
    });
  }

  autenticar(data: { username: string; password: string; }) {
    return new Promise(resolve => {
      if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
        const params = new HttpParams()
          .set('username', data.username)
          .set('password', data.password)
          .set('grant_type', 'password');

        this.http.post(environment.host + 'oauth/token', params, { headers: this.getHttpHeadersBasic() })
          .subscribe((respuesta: any) => {
            this.inicializarDatosUsuario(respuesta).then(resultado => resolve(resultado));
          }, error => {
            if (error.status === 400 || error.status === 401) resolve({ exitoso: false, status: error.status, mensaje: 'Credenciales inválidas!' });
            else if (error.status === 0) resolve({ exitoso: false, status: error.status, mensaje: 'No existe comunicación con el servidor!' });
            else resolve(error);
          });
      } else {
        resolve({ exitoso: false, status: 0, mensaje: 'No existe conexion!' });
      }
    });
  }

  private obtenerDatosUsuario(datos: any) {
    return new Promise(resolve => {
      this.getHttpHeadersOnlyTokenParam(datos.access_token).then((headers: HttpHeaders) => {
        if (headers) {
          this.http.post(this.api + 'usuario/datosIniciales', { token: datos.access_token }, { headers })
            .subscribe(respuesta => resolve(respuesta),
              () => resolve({ exitoso: false, mensaje: '' }));
        } else {
          resolve({ exitoso: false, mensaje: 'Error al obtener los headers!' });
        }
      });
    });
  }

  actualizarDatosUsuario() {
    return new Promise(resolve => {
      this.getHttpHeadersOnlyToken().then((headers: HttpHeaders | null) => {
        if (headers) {
          this.http.post(this.api + 'usuario/datosIniciales', null, { headers })
            .subscribe(async (respuesta: any) => {
              if (respuesta.exitoso) {
                const ok = await this.almacenarDatosUsuario(respuesta.datos).then((r: any) => r.exitoso);
                resolve({ exitoso: ok });
              } else {
                resolve(respuesta);
              }
            }, () => resolve({ exitoso: false, mensaje: '' }));
        } else {
          resolve({ exitoso: false, mensaje: 'Error al obtener los headers!' });
        }
      });
    });
  }

  private almacenarTokens(datosAutenticacion: any) {
    return new Promise(resolve => {
      if (datosAutenticacion.access_token) {
        this.storageService.setItem('token', datosAutenticacion.access_token).then(() => {
          const fechaExpira = new Date();
          fechaExpira.setSeconds(fechaExpira.getSeconds() + datosAutenticacion.expires_in);
          this.storageService.setItem('tokenE', fechaExpira.getTime().toString()).then(() => {
            this.storageService.setItem('tokenR', datosAutenticacion.refresh_token).then(() => {
              resolve({ exitoso: true });
            });
          });
        });
      } else {
        resolve({ exitoso: false });
      }
    });
  }

  private inicializarDatosUsuario(datosAutenticacion: any) {
    return new Promise(resolve => {
      this.almacenarTokens(datosAutenticacion).then((tokensAlmacenados: any) => {
        if (tokensAlmacenados.exitoso) {
          this.obtenerDatosUsuario(datosAutenticacion).then((respuesta: any) => {
            if (respuesta.exitoso) {
              this.almacenarDatosUsuario(respuesta.datos).then((exitoso: any) => {
                resolve({ exitoso: exitoso.exitoso === true });
              });
            } else {
              resolve(respuesta);
            }
          });
        } else {
          resolve({ exitoso: false });
        }
      });
    });
  }

  private async almacenarDatosUsuario(datosUsuario: any) {
    try {
      const info = await App.getInfo(); // { name, id, version, build }
      const versionLocal = parseFloat(info.version || '0');
      const versionSistema = parseFloat(datosUsuario.appVersion || '0');

      if (versionSistema > versionLocal) {
        this.alertaNuevaVersion();
      }
    } catch (e) {
      // Ignorar si no se puede obtener info
    }

    this.storageService.iniciarSesion(datosUsuario);

    await this.storageService.setItemObject('usuario', datosUsuario.usuario);
    await this.storageService.setItemObject('cantidadGratis', datosUsuario.cantidadGratis);
    await this.storageService.setItemObject('tiendas', datosUsuario.tiendas);
    await this.storageService.setItemObject('departamentos', datosUsuario.departamentos);
    await this.storageService.setItemObject('municipios', datosUsuario.municipios);
    await this.storageService.setItemObject('tipoMascotas', datosUsuario.tipoMascotas);
    await this.storageService.setItemObject('razas', datosUsuario.razas);
    await this.storageService.setItemObject('enfermedades', datosUsuario.enfermedades);
    await this.storageService.setItem('terminos', datosUsuario.terminos);

    return { exitoso: true };
  }

  verificarEstadoUsuario() {
    this.storageService.getItemObject('usuario').then((usuario: any) => {
      if (usuario != null) {
        if (usuario.state === 'DATOS_COMPLETAR') {
          this.actualizarDatosUsuario();
          this.storageService.setItem('usuario-navegacion', 'COMPLETAR');
          this.navController.navigateForward('/wizard-datos-usuario');
        } else if (usuario.state === 'CAMBIAR_CONTRASENIA') {
          this.actualizarDatosUsuario().then(() => {
            this.storageService.getItemObject('usuario').then((usu: any) => {
              if (usu.state === 'DATOS_COMPLETAR') {
                this.storageService.setItem('usuario-navegacion', 'COMPLETAR');
                this.navController.navigateForward('/wizard-datos-usuario');
              } else if (usu.state === 'CAMBIAR_CONTRASENIA') {
                this.storageService.setItem('contrasenia', 'CAMBIAR');
                this.navController.navigateForward('/solicitar-contrasenia');
              }
            });
          });
        }
      }
    });
  }

  revocarToken() {
    return new Promise(resolve => {
      this.postApi('usuario/revocarToken', null).then((resultado: any) => {
        resolve(!!resultado?.exitoso);
      }).catch(() => resolve(false));
    });
  }

  alertaNuevaVersion() {
    const opciones = {
      idAlert: 'GUARDAR_FINALIZAR',
      titulo: 'App',
      mensaje: 'Actualización disponible',
      botones: [
        { text: 'Cancelar', handler: () => {} },
        {
          text: 'Actualizar',
          handler: () => this.openStore()
        }
      ]
    };
    this.alertasService.presentarAlerta(opciones);
  }

  private async openStore() {
    try {
      let url: string | undefined;

      if (Capacitor.getPlatform() === 'android') {
        url = environment.playStoreUrl
          || (environment.packageId ? `https://play.google.com/store/apps/details?id=${environment.packageId}` : undefined)
          || 'https://play.google.com/store/search?q=tommyspetshop';
      } else if (Capacitor.getPlatform() === 'ios') {
        url = environment.appStoreUrl || 'https://apps.apple.com/';
      } else {
        url = environment.playStoreUrl || environment.appStoreUrl || 'https://play.google.com/';
      }

      await Browser.open({ url });
    } catch (e) {
      // Silencio: si falla abrir el browser, no rompemos el flujo
    }
  }

  private async writeBlobToDataDir(filename: string, blob: Blob): Promise<string> {
    const base64 = await this.blobToBase64(blob);
    const write = await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Data
    });
    return write.uri; 
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    const buffer = await blob.arrayBuffer();
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  private extraerNombre(pathOrUrl: string): string {
    try {
      const decoded = decodeURIComponent(pathOrUrl);
      const m = decoded.match(/[^/\\]+$/);
      return m ? m[0] : decoded;
    } catch {
      return pathOrUrl;
    }
  }
}