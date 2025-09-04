import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Market } from '@ionic-native/market/ngx';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AlertasService } from './alertas.service';
import { ConnectionStatus, NetworkService } from './network.service';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class RestApiService {

    private api;
    private apiPublic;

    constructor(
        private navController: NavController,
        private appVersion: AppVersion,
        private http: HttpClient,
        private market: Market,
        private file: File,
        private transfer: FileTransfer,
        private networkService: NetworkService,
        private alertasService: AlertasService,
        private storageService: StorageService
    ) { 
        this.api = environment.host + 'api/v2/';
        this.apiPublic = environment.host + 'apiPublic/v2/';
    }

    getHttpHeadersBasic() {
        return new HttpHeaders()
            .set('Authorization', 'Basic ' + btoa(environment.appC + ":" + environment.appS))
            .set('Content-Type', 'application/x-www-form-urlencoded');
    }

    getHttpHeadersToken() {
        return new Promise(resolve => {
            this.storageService.getItem('token').then(token => {
                if (token != null) {
                    resolve(new HttpHeaders().set('Authorization', 'Bearer ' + token).append('Content-Type', 'application/json'));
                }else{
                    resolve(new HttpHeaders().append('Content-Type', 'application/json'));
                }
            }).catch(error => {
                resolve(null);
            });
        });
    }

    getHttpHeadersOnlyToken() {
        return new Promise(resolve => {
            this.storageService.getItem('token').then(token => {
                if (token != null) {
                    resolve(new HttpHeaders().set('Authorization', 'Bearer ' + token));
                }else{
                    resolve(new HttpHeaders());
                }
            }).catch(error => {
                resolve(null);
            });
        });
    }

    getHttpHeadersOnlyTokenParam(token) {
        return new Promise(resolve => {
            if (token != null) {
                resolve(new HttpHeaders().set('Authorization', 'Bearer ' + token));
            } else {
                resolve(new HttpHeaders());
            }
        });
    }

    postApi(url, data) {
        return new Promise(resolve => {
            if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
                this.getHttpHeadersToken().then((headers: HttpHeaders) => {
                    if (headers != null) {
                        this.http.post(this.api + url, data, { headers: headers })
                            .subscribe(respuesta => {
                                resolve(respuesta);
                            }, err => {
                                resolve({exitoso: false, mensaje: ''});
                            });
                    } else {
                        resolve({exitoso: false, mensaje: 'Error al obtener los headers!'});
                    }
                });
            } else {
                resolve({exitoso: false, mensaje: 'No existe conexion!'});
            }
        });
    }

    postApiPublic(url, data) {
        return new Promise(resolve => {
            if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
                this.http.post(this.apiPublic + url, data)
                .subscribe(respuesta => {
                    resolve(respuesta);
                }, err => {
                    resolve({exitoso: false, mensaje: ''});
                });
            } else {
                resolve({exitoso: false, mensaje: 'No existe conexion!'});
            }
        });
    }

    postFileApi(url, data) {
        return new Promise(resolve => {
            if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
                this.getHttpHeadersOnlyToken().then((headers: HttpHeaders) => {
                    if (headers != null) {
                        this.http.post(this.api + url, data, { headers: headers })
                            .subscribe(respuesta => {
                                resolve(respuesta);
                            }, err => {
                                resolve({exitoso: false, mensaje: ''});
                            });
                    } else {
                        resolve({exitoso: false, mensaje: 'Error al obtener los headers!'});
                    }
                });
            } else {
                resolve({exitoso: false, mensaje: 'No existe conexion!'});
            }
        });
    }

    getFileApi(url, localUrl, data) {
        return new Promise(resolve => {
            if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
                this.getHttpHeadersToken().then((headers: HttpHeaders) => {
                    if (headers != null) {
                        this.http.post(this.api + url, data, { headers: headers, responseType: 'blob' })
                            .subscribe((fileBlob: Blob) => {
                                this.file.writeFile(localUrl, data.nombre, fileBlob, {replace: true}).then(archivo => {
                                    console.log('Archivo descargado', archivo);

                                    resolve({exitoso: true, mensaje: '', archivo: archivo});
                                }).catch(error => {
                                    resolve({exitoso: false, mensaje: ''});
                                });
                            }, err => {
                                resolve({exitoso: false, mensaje: ''});
                            });
                    } else {
                        resolve({exitoso: false, mensaje: 'Error al obtener los headers!'});
                    }
                });
                
            } else {
                resolve({exitoso: false, mensaje: 'No existe conexion!'});
            }
        });
    }

    downloadFile(urlFile, localUrl) {
        return new Promise(resolve => {
            if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
                const fileTransfer = this.transfer.create();
                fileTransfer.download(urlFile, localUrl).then(archivo => {
                    console.log('Archivo descargado', archivo);

                    resolve({exitoso: true, mensaje: '', archivo: archivo});
                }).catch(error => {
                    resolve({exitoso: false, mensaje: ''});
                });
            } else {
                resolve({exitoso: false, mensaje: 'No existe conexion!'});
            }
        });
    }

    registrar(data) {
        return new Promise(resolve => {
            if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
                const params = new HttpParams()
                    .set('correo', data.correo)
                    .set('password', data.password)

                this.http.post(this.apiPublic + 'registrar/nuevoUsuario',
                    params,
                    {
                        headers: this.getHttpHeadersBasic()
                    }).subscribe((respuesta: any) => {
                        if(respuesta.exitoso){
                            resolve(respuesta);
                        }else{
                            resolve({exitoso: false, mensaje: respuesta.mensaje});
                        }
                    }, error => {
                        if (error.status !== undefined && error.status !== null && error.status === 400) {
                            resolve({exitoso: false, status: error.status, mensaje: 'Credenciales inválidas!'});
                        }else if (error.status !== undefined && error.status !== null && error.status === 0) {
                            resolve({exitoso: false,  status: error.status, mensaje: 'No existe comunicación con el servidor!'});
                        }
                        resolve(error);
                    });
            } else {
                resolve({exitoso: false, status: 0, mensaje: 'No existe conexion!'});
            }
        });
    }

    confirmar(data) {
        return new Promise(resolve => {
            if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
                const params = new HttpParams()
                    .set('correo', data.correo)
                    .set('codigo', data.codigo)

                this.http.post(this.apiPublic + 'registrar/confirmarCodigo',
                    params,
                    {
                        headers: this.getHttpHeadersBasic()
                    }).subscribe((respuesta: any) => {
                        if(respuesta.exitoso){
                            resolve(respuesta);
                        }else{
                            resolve({exitoso: false, mensaje: respuesta.mensaje});
                        }
                    }, error => {
                        if (error.status !== undefined && error.status !== null && error.status === 400) {
                            resolve({exitoso: false, status: error.status, mensaje: 'Credenciales inválidas!'});
                        }else if (error.status !== undefined && error.status !== null && error.status === 0) {
                            resolve({exitoso: false,  status: error.status, mensaje: 'No existe comunicación con el servidor!'});
                        }
                        resolve(error);
                    });
            } else {
                resolve({exitoso: false, status: 0, mensaje: 'No existe conexion!'});
            }
        });
    }

    solicitarContrasenia(data) {
        return new Promise(resolve => {
            if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
                const params = new HttpParams().set('correo', data.correo)

                this.http.post(this.apiPublic + 'registrar/solicitarContrasenia',
                    params,
                    {
                        headers: this.getHttpHeadersBasic()
                    }).subscribe((respuesta: any) => {
                        if(respuesta.exitoso){
                            resolve(respuesta);
                        }else{
                            resolve({exitoso: false, mensaje: respuesta.mensaje});
                        }
                    }, error => {
                        if (error.status !== undefined && error.status !== null && error.status === 400) {
                            resolve({exitoso: false, status: error.status, mensaje: 'Credenciales inválidas!'});
                        }else if (error.status !== undefined && error.status !== null && error.status === 0) {
                            resolve({exitoso: false,  status: error.status, mensaje: 'No existe comunicación con el servidor!'});
                        }
                        resolve(error);
                    });
            } else {
                resolve({exitoso: false, status: 0, mensaje: 'No existe conexion!'});
            }
        });
    }

    autenticar(data) {
        return new Promise(resolve => {
            if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
                const params = new HttpParams()
                    .set('username', data.username)
                    .set('password', data.password)
                    .set('grant_type', 'password');

                this.http.post(environment.host + 'oauth/token',
                    params,
                    {
                        headers: this.getHttpHeadersBasic()
                    }).subscribe((respuesta: any) => {
                        this.inicializarDatosUsuario(respuesta).then(resultado => {
                            resolve(resultado);
                        });
                    }, error => {
                        if (error.status !== undefined && error.status !== null && (error.status === 400 || error.status === 401)) {
                            resolve({exitoso: false, status: error.status, mensaje: 'Credenciales inválidas!'});
                        }else if (error.status !== undefined && error.status !== null && error.status === 0) {
                            resolve({exitoso: false,  status: error.status, mensaje: 'No existe comunicación con el servidor!'});
                        }
                        resolve(error);
                    });
            } else {
                resolve({exitoso: false, status: 0, mensaje: 'No existe conexion!'});
            }
        });
    }

    private obtenerDatosUsuario(datos) {
        return new Promise(resolve => {
            this.getHttpHeadersOnlyTokenParam(datos.access_token).then((headers: HttpHeaders) => {
                if (headers != null) {
                    this.http.post(this.api + 'usuario/datosIniciales', { token: datos.access_token }, { headers: headers }).subscribe(respuesta => {
                        resolve(respuesta);
                    }, err => {
                        resolve({exitoso: false, mensaje: ''});
                    });
                } else {
                    resolve({exitoso: false, mensaje: 'Error al obtener los headers!'});
                }
            });
        });
    }

    actualizarDatosUsuario() {
        return new Promise(resolve => {
            this.getHttpHeadersOnlyToken().then((headers: HttpHeaders) => {
                if (headers != null) {
                    this.http.post(this.api + 'usuario/datosIniciales', null, { headers: headers }).subscribe((respuesta: any) => {
                        if (respuesta.exitoso) {
                            this.almacenarDatosUsuario(respuesta.datos).then(exitoso => {
                                resolve({exitoso: exitoso});
                            });
                        } else {
                            resolve(respuesta);
                        }
                    }, err => {
                        resolve({exitoso: false, mensaje: ''});
                    });
                } else {
                    resolve({exitoso: false, mensaje: 'Error al obtener los headers!'});
                }
            });
        });
    }

    private almacenarTokens(datosAutenticacion){
        return new Promise(resolve => {
            if (datosAutenticacion.access_token !== undefined && datosAutenticacion.access_token !== null) {
                this.storageService.setItem('token', datosAutenticacion.access_token).then((exitoso: boolean) => {
                    const fechaExpira = new Date();
                    fechaExpira.setSeconds(fechaExpira.getSeconds() + datosAutenticacion.expires_in);
                    this.storageService.setItem('tokenE', fechaExpira.getTime().toString()).then((exitoso: boolean) => {
                        this.storageService.setItem('tokenR', datosAutenticacion.refresh_token).then((exitoso: boolean) => {
                            resolve({exitoso: true});
                        });
                    });
                });
            }else{
                resolve({exitoso: false});
            }
        });
    }

    private inicializarDatosUsuario(datosAutenticacion) {
        return new Promise(resolve => {
            this.almacenarTokens(datosAutenticacion).then((tokensAlmacenados: any) => {
                if(tokensAlmacenados.exitoso){
                    this.obtenerDatosUsuario(datosAutenticacion).then((respuesta: any) => {
                        if (respuesta.exitoso) {
                            this.almacenarDatosUsuario(respuesta.datos).then(exitoso => {
                                resolve({exitoso: exitoso});
                            });
                        } else {
                            resolve(respuesta);
                        }
                    });
                }else{
                    resolve({exitoso: false});
                }
            });
        });
    }

    private almacenarDatosUsuario(datosUsuario) {
        return new Promise(resolve => {
            this.appVersion.getVersionNumber().then(appVersion => {
                let version = parseFloat(appVersion);
                let versionSistema = parseFloat(datosUsuario.appVersion);
                if(versionSistema > version){
                    this.alertaNuevaVersion();
                }
            });

            this.storageService.iniciarSesion(datosUsuario);
            
            this.storageService.setItemObject('usuario', datosUsuario.usuario).then((exitoso: boolean) => {
                this.storageService.setItemObject('cantidadGratis', datosUsuario.cantidadGratis).then((exitoso: boolean) => {
                    this.storageService.setItemObject('tiendas', datosUsuario.tiendas).then((exitoso: boolean) => {
                        this.storageService.setItemObject('departamentos', datosUsuario.departamentos).then((exitoso: boolean) => {
                            this.storageService.setItemObject('municipios', datosUsuario.municipios).then((exitoso: boolean) => {
                                this.storageService.setItemObject('tipoMascotas', datosUsuario.tipoMascotas).then((exitoso: boolean) => {
                                    this.storageService.setItemObject('razas', datosUsuario.razas).then((exitoso: boolean) => {
                                        this.storageService.setItemObject('enfermedades', datosUsuario.enfermedades).then((exitoso: boolean) => {
                                            this.storageService.setItem('terminos', datosUsuario.terminos).then((exitoso: boolean) => {
                                                resolve({exitoso: true});
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    verificarEstadoUsuario() {
        this.storageService.getItemObject('usuario').then((usuario: any) => {
            if (usuario != null) {
                if (usuario.state == 'DATOS_COMPLETAR') {
                    this.actualizarDatosUsuario();

                    this.storageService.setItem('usuario-navegacion', 'COMPLETAR');
                    this.navController.navigateForward('/wizard-datos-usuario');
                } else if (usuario.state == 'CAMBIAR_CONTRASENIA') {
                    this.actualizarDatosUsuario().then((respuesta: any) => {
                        this.storageService.getItemObject('usuario').then((usuario: any) => {
                            if (usuario.state == 'DATOS_COMPLETAR') {
                                this.storageService.setItem('usuario-navegacion', 'COMPLETAR');
                                this.navController.navigateForward('/wizard-datos-usuario');
                            } else if (usuario.state == 'CAMBIAR_CONTRASENIA') {
                                this.storageService.setItem('contrasenia', 'CAMBIAR');
                                this.navController.navigateForward('/solicitar-contrasenia');
                            }
                        });
                    });
                }
            }
        });
    }

    revocarToken(){
        return new Promise(resolve => {
            this.postApi('usuario/revocarToken', null).then((resultado: any) => {
                if (resultado.exitoso) {
                    resolve(true);
                }else{
                    resolve(false);    
                }
            }).catch(error => {
                resolve(false);
            });
        });
    }

    alertaNuevaVersion() {
        let opciones = {
            idAlert: 'GUARDAR_FINALIZAR',
            titulo: "App",
            mensaje: 'Actualización disponible',
            botones: [
                {
                    text: 'Cancelar',
                    handler: () => {}
                },
                {
                    text: 'Actualizar',
                    handler: () => {
                        this.market.open('com.brothersvas.tommyspetshop.app');
                    }
                }
            ]
        }
        this.alertasService.presentarAlerta(opciones);
    }
}
