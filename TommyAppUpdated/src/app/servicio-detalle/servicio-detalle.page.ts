import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ModalController, NavController } from '@ionic/angular';
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
})
export class ServicioDetallePage implements OnInit {

    tipoProducto = 'ASEO';
    tipoProductoEtiqueta = 'Grooming SPA';
    multimedias = []
    servicio;
    loading;

    constructor(
        private navController: NavController,
        private modalController: ModalController,
        private socialSharing: SocialSharing,
        private file: File,
        private sanitizer: DomSanitizer,
        private restApiService: RestApiService,
        private alertasService: AlertasService,
        private multimediaService: MultimediaService,
        public storageService: StorageService,
        private networkService: NetworkService
    ) { }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.cargarDetalle();
    }

    cargarDetalle() {
        this.alertasService.presentLoading('');

        this.multimedias = [];
        this.storageService.getItem('idServicio').then(idServicio =>{
            this.storageService.getItem('tipoProducto').then((tipoProducto: any) =>{
                this.tipoProducto = tipoProducto;
                if(tipoProducto == 'PASEO'){
                    this.tipoProductoEtiqueta = 'Dog Walker'
                }
                if(idServicio !== undefined && idServicio !== null){
                    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
                        this.restApiService.postApi('servicio/consulta', { idServicio: idServicio }).then((respuesta: any) => {    
                            if (respuesta.exitoso) {
                                this.servicio = respuesta.datos.servicio;
                                
                                if (this.servicio.mascota.urlFoto !== undefined && this.servicio.mascota.urlFoto !== null) {
                                    this.servicio.mascota.urlFotoSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.servicio.mascota.urlFoto);
                                }
                                
                                respuesta.datos.multimedias.forEach(multimedia => {
                                    if(multimedia.url !== undefined && multimedia !== null){
                                        this.multimediaService.existeArchivo(multimedia.url).then((resultado: any) =>{
                                            if(resultado.existe){
                                                multimedia.url = resultado.url;
                                                multimedia.urlSafe = resultado.urlSafe;
                                            }else{
                                                this.multimediaService.descargar(multimedia.url);
                                                multimedia.urlSafe = multimedia.url;
                                            }
                                            this.multimedias.push(multimedia);
                                        });
                                    }else{
                                        this.multimedias.push(multimedia);
                                    }
                                });
                            } else {
                                console.error('No se han podido consultar el aseo.', respuesta);
                            }
                            
                            this.storageService.removeItem('idServicio');
                            this.alertasService.dismissLoading();
                        });
                    } else {

                    }
                }else{
                    this.storageService.getItemObject('servicio').then((servicio: any) => {
                        this.servicio = servicio;

                        if (this.servicio.mascota.urlFoto !== undefined && this.servicio.mascota.urlFoto !== null) {
                            this.servicio.mascota.urlFotoSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.servicio.mascota.urlFoto);
                        }
                        
                        if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
                            this.restApiService.postApi('multimedia/porServicio', { idServicio: servicio.id }).then((respuesta: any) => {    
                                if (respuesta.exitoso) {
                                    respuesta.datos.multimedias.forEach(multimedia => {
                                        if(multimedia.url !== undefined && multimedia !== null){
                                            this.multimediaService.existeArchivo(multimedia.url).then((resultado: any) =>{
                                                if(resultado.existe){
                                                    multimedia.url = resultado.url;
                                                    multimedia.urlSafe = resultado.urlSafe;
                                                }else{
                                                    this.multimediaService.descargar(multimedia.url);
                                                    multimedia.urlSafe = multimedia.url;
                                                }
                                                this.multimedias.push(multimedia);

                                                this.storageService.setItemObject('multimedias' + servicio.id, this.multimedias);
                                            });
                                        }else{
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
                                if(multimedias !== null){
                                    this.multimedias = multimedias;
                                }else{
                                    this.multimedias = [];
                                }
                            });

                            this.alertasService.dismissLoading();
                        }
                    });
                }
            });
        });
    }

    capturarFoto(){
        this.multimediaService.capturarFotoUrl().then((foto: any) =>{
            if(foto != null){
                this.storageService.removeItem('video');
                this.storageService.setItemObject('foto', foto);
                this.navController.navigateForward('/servicio-multimedia');
            }
        });
    }

    capturarVideo(){
        this.alertasService.presentLoading('Optimizando Video');
        this.multimediaService.capturarVideoUrl().then((video: any) =>{
            this.alertasService.dismissLoading();

            if(video != null){
                this.storageService.removeItem('foto');
                this.storageService.setItemObject('video', video);
                this.navController.navigateForward('/servicio-multimedia');
            }
        });
    }

    compartir(urlFile){
        this.alertasService.presentLoading('');

        const url = decodeURIComponent(urlFile);
        const nombre = url.replace(/^.*[\\\/]/, '');
        const nombreLocal = this.file.dataDirectory + nombre;

        this.multimediaService.existeArchivo(urlFile).then((resultado: any) =>{
            if(resultado.existe){
                this.socialSharing.share(null, null, resultado.nativeURL, null).then(resultado => {
                    console.log('Compartir', resultado);
                    this.alertasService.dismissLoading();
                }).catch(error => {
                    console.error('Compartir', error);
                    this.alertasService.dismissLoading();
                });

                this.alertasService.dismissLoading();
            }else{
                this.restApiService.downloadFile(url, nombreLocal).then((resultado: any) =>{
                    if(resultado.exitoso){
                         this.socialSharing.share(null, null, resultado.archivo.nativeURL, null).then(resultado => {
                            console.log('Compartir', resultado);
                            this.alertasService.dismissLoading();
                        }).catch(error => {
                            console.error('Compartir', error);
                            this.alertasService.dismissLoading();
                        });
                    }
                    
                    this.alertasService.dismissLoading();
                });
            }
        });
    }

    compartirVideo(){

    }

    alertaAgregar(mensaje, exitoso) {
        let opciones = {
            idAlert: 'GUARDAR_FINALIZAR',
            titulo: 'Agregar Foto',
            mensaje: mensaje,
            botones: [
                {
                    text: 'Aceptar',
                    handler: () => {
                        if(exitoso){
                            
                        }else{
                            
                        }
                        
                    }
                }
            ]
        }
        this.alertasService.presentarAlerta(opciones);
    }

    async mostrarMultimedia(url) {
        const modal = await this.modalController.create({
            component: MultimediaModalPage,
            cssClass: 'multimedia-modal',
            componentProps: {
                url: url
            }
        });
        modal.present();
    }

}
