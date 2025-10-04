import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

import { AlertasService } from 'src/services/alertas.service';
import { MultimediaService } from 'src/services/multimedia.service';
import { ConnectionStatus, NetworkService } from 'src/services/network.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';
import { MultimediaModalPage } from '../multimedia-modal/multimedia-modal.page';

@Component({
  selector: 'app-servicio-detalle',
  templateUrl: './servicio-detalle.page.html',
  styleUrls: ['./servicio-detalle.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ServicioDetallePage implements OnInit {

  tipoProducto = 'ASEO';
  tipoProductoEtiqueta = 'Grooming SPA';
  multimedias: any[] = [];
  servicio: any;
  loading: any;

  constructor(
    private navController: NavController,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    private restApiService: RestApiService,
    private alertasService: AlertasService,
    private multimediaService: MultimediaService,
    public storageService: StorageService,
    private networkService: NetworkService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.cargarDetalle();
  }

  private toDisplayUrl(pathOrUrl?: string): SafeResourceUrl | null {
    if (!pathOrUrl) return null;
    try {
      if (pathOrUrl.startsWith('file://') || pathOrUrl.startsWith('content://')) {
        const converted = Capacitor.convertFileSrc(pathOrUrl);
        return this.sanitizer.bypassSecurityTrustResourceUrl(converted);
      }
      return this.sanitizer.bypassSecurityTrustResourceUrl(pathOrUrl);
    } catch {
      return null;
    }
  }

  cargarDetalle() {
    this.alertasService.presentLoading('');

    this.multimedias = [];
    this.storageService.getItem('idServicio').then(idServicio => {
      this.storageService.getItem('tipoProducto').then((tipoProducto: any) => {
        this.tipoProducto = tipoProducto;
        if (tipoProducto === 'PASEO') {
          this.tipoProductoEtiqueta = 'Dog Walker';
        }

        if (idServicio !== undefined && idServicio !== null) {
          if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
            this.restApiService.postApi('servicio/consulta', { idServicio }).then((respuesta: any) => {
              if (respuesta.exitoso) {
                this.servicio = respuesta.datos.servicio;

                if (this.servicio?.mascota?.urlFoto) {
                  this.servicio.mascota.urlFotoSafe = this.toDisplayUrl(this.servicio.mascota.urlFoto);
                }

                (respuesta.datos.multimedias || []).forEach((multimedia: any) => {
                  if (multimedia?.url) {
                    this.multimediaService.existeArchivo(multimedia.url).then((resultado: any) => {
                      if (resultado.existe) {
                        multimedia.url = resultado.url;
                        multimedia.urlSafe = resultado.urlSafe;
                        multimedia.nativeURL = resultado.nativeURL ?? multimedia.nativeURL;
                      } else {
                        this.multimediaService.descargar(multimedia.url);
                        multimedia.urlSafe = this.toDisplayUrl(multimedia.url);
                      }
                      this.multimedias.push(multimedia);
                    });
                  } else {
                    this.multimedias.push(multimedia);
                  }
                });
              } else {
                console.error('No se han podido consultar el servicio.', respuesta);
              }

              this.storageService.removeItem('idServicio');
              this.alertasService.dismissLoading();
            });
          } else {
            this.alertasService.dismissLoading();
          }
        } else {
          this.storageService.getItemObject('servicio').then((servicio: any) => {
            this.servicio = servicio;

            if (this.servicio?.mascota?.urlFoto) {
              this.servicio.mascota.urlFotoSafe = this.toDisplayUrl(this.servicio.mascota.urlFoto);
            }

            if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
              this.restApiService.postApi('multimedia/porServicio', { idServicio: servicio.id }).then((respuesta: any) => {
                if (respuesta.exitoso) {
                  (respuesta.datos.multimedias || []).forEach((multimedia: any) => {
                    if (multimedia?.url) {
                      this.multimediaService.existeArchivo(multimedia.url).then((resultado: any) => {
                        if (resultado.existe) {
                          multimedia.url = resultado.url;
                          multimedia.urlSafe = resultado.urlSafe;
                          multimedia.nativeURL = resultado.nativeURL ?? multimedia.nativeURL;
                        } else {
                          this.multimediaService.descargar(multimedia.url);
                          multimedia.urlSafe = this.toDisplayUrl(multimedia.url);
                        }
                        this.multimedias.push(multimedia);

                        this.storageService.setItemObject('multimedias' + servicio.id, this.multimedias);
                      });
                    } else {
                      this.multimedias.push(multimedia);
                      this.storageService.setItemObject('multimedias' + servicio.id, this.multimedias);
                    }
                  });
                } else {
                  console.error('No se han podido cargar las fotos y videos.', respuesta);
                }

                this.alertasService.dismissLoading();
              });
            } else {
              this.storageService.getItemObject('multimedias' + servicio.id).then((multimedias: any) => {
                this.multimedias = multimedias ?? [];
              });
              this.alertasService.dismissLoading();
            }
          });
        }
      });
    });
  }

  capturarFoto() {
    this.multimediaService.capturarFotoUrl().then((foto: any) => {
      if (foto != null) {
        this.storageService.removeItem('video');
        this.storageService.setItemObject('foto', foto);
        this.navController.navigateForward('/servicio-multimedia');
      }
    });
  }

  capturarVideo() {
    this.alertasService.presentLoading('Optimizando Video');
    this.multimediaService.capturarVideoUrl().then((video: any) => {
      this.alertasService.dismissLoading();

      if (video != null) {
        this.storageService.removeItem('foto');
        this.storageService.setItemObject('video', video);
        this.navController.navigateForward('/servicio-multimedia');
      }
    });
  }

  async compartir(urlFile: string) {
    this.alertasService.presentLoading('');

    try {
      const existe = await this.multimediaService.existeArchivo(urlFile);
      if (existe?.existe) {
        const localUri = existe.nativeURL || (urlFile.startsWith('file://') ? urlFile : undefined);
        if (localUri) {
          await this.compartirLocal(localUri);
          this.alertasService.dismissLoading();
          return;
        }
      }

      const descargado = await this.multimediaService.descargar(urlFile);
      if (descargado?.exitoso && descargado.nativeURL) {
        await this.compartirLocal(descargado.nativeURL);
      } else {
        throw new Error('No se pudo descargar el archivo para compartir.');
      }
    } catch (e) {
      console.error('Compartir', e);
    } finally {
      this.alertasService.dismissLoading();
    }
  }

  private async compartirLocal(fileUri: string) {
    try {
      await Share.share({
        files: [fileUri],
      });
    } catch (err) {
      console.error('Error al compartir:', err);
    }
  }

  compartirVideo() {
    // reutiliza compartir(urlFile) con la URL del video si lo necesitas
  }

  alertaAgregar(mensaje: string, exitoso: boolean) {
    const opciones = {
      idAlert: 'GUARDAR_FINALIZAR',
      titulo: 'Agregar Foto',
      mensaje,
      botones: [
        {
          text: 'Aceptar',
          handler: () => {
            if (exitoso) {
              // no-op
            } else {
              // no-op
            }
          },
        },
      ],
    };
    this.alertasService.presentarAlerta(opciones);
  }

  async mostrarMultimedia(url: string) {
    const modal = await this.modalController.create({
      component: MultimediaModalPage, // asegúrate de que también sea standalone
      cssClass: 'multimedia-modal',
      componentProps: { url },
    });
    await modal.present();
  }
}