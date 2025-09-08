import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { File } from '@ionic-native/file/ngx';
import { NavController, Platform } from '@ionic/angular';
import { AlertasService } from 'src/services/alertas.service';
import { MultimediaService } from 'src/services/multimedia.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
    selector: 'app-servicio-multimedia',
    templateUrl: './servicio-multimedia.page.html',
    styleUrls: ['./servicio-multimedia.page.scss'],
})
export class ServicioMultimediaPage implements OnInit {

    tipoProducto = 'ASEO'
    multimediaForm
    foto;
    video;
    servicio;

    constructor(
        private navController: NavController,
        private form: FormBuilder,
        private file: File,
        private sanitizer: DomSanitizer,
        private platform: Platform,
        private multimediaService: MultimediaService,
        private alertasService: AlertasService,
        private storageService: StorageService,
        private restApiService: RestApiService
    ) { }

    ngOnInit() {
        this.multimediaForm = this.form.group({'mensaje': ['']});
        const win: any = window;

        this.storageService.getItemObject('servicio').then((servicio: any) => {
            this.servicio = servicio;
            this.storageService.getItemObject('foto').then((foto: any) => {
                if(foto != null){        
                    let url = win.Ionic.WebView.convertFileSrc(foto.url)
                    if (this.platform.is('ios')) {
                        url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
                    }

                    foto.urlFileSrc = url;
                    foto.idServicio = servicio.id;
                    this.foto = foto;
                }
            });
            this.storageService.getItemObject('video').then((video: any) => {
                if(video != null){
                    let url = win.Ionic.WebView.convertFileSrc(video.url)
                    if (this.platform.is('ios')) {
                        url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
                    }

                    video.urlFileSrc = url;
                    video.idServicio = servicio.id;
                   
                    this.video = video;
                }
            });
        });

        this.storageService.getItem('tipoProducto').then((tipoProducto: any) =>{
            this.tipoProducto = tipoProducto;
        });
    }

    enviar(){
        this.alertasService.presentLoading('');
        if(this.foto !== undefined){
            this.foto.mensaje = this.multimediaForm.get('mensaje') !== null ? this.multimediaForm.get('mensaje').value : null;
            this.foto.tipoProducto = this.tipoProducto;
        }
        if(this.video !== undefined){
            this.video.mensaje = this.multimediaForm.get('mensaje') !== null ? this.multimediaForm.get('mensaje').value : null;
            this.video.tipoProducto = this.tipoProducto;
        }
        this.subirArchivo().then((respuesta: any) => {
            if(respuesta.exitoso){
                this.alertaEnviar(respuesta.mensaje, true);
            }else {
                this.alertaEnviar(respuesta.mensaje, false);
            }
            this.alertasService.dismissLoading();
       });
    }

    subirArchivo() {
        return new Promise((resolve) => {
            let datos = this.foto !== undefined ? this.foto : this.video;
            
            console.log('datos', datos);
            this.file.resolveDirectoryUrl(datos.rutaLocal).then(directorio => {
                console.log('resolveDirectoryUrl', directorio);

                this.file.getFile(directorio, datos.nombreLocal, { create: false }).then(fileEntry => {
                    fileEntry.file(file => {
                        this.file.readAsArrayBuffer(datos.rutaLocal, datos.nombreLocal).then(result => {
                            let blob = new Blob([result], {type: file.type});
                            let formData = new FormData();
                            formData.append('archivo', blob, datos.nombreLocal);
                            formData.append('extension', datos.extension);
                            formData.append('datos',  JSON.stringify(datos));

                            this.restApiService.postFileApi('multimedia/agregar', formData).then(respuesta => {
                                console.log('Subida de arvhivo:', respuesta);
                                resolve(respuesta);
                            });
                        }).catch(error =>{
                            console.error('readAsArrayBuffer', error);
                        });
                    });
                }).catch(error =>{
                    console.error('getFile', error);
                });
            }).catch(error =>{
                console.error('resolveDirectoryUrl', error);
            });
        });
    }

    alertaEnviar(mensaje, exitoso) {
        let opciones = {
            idAlert: 'GUARDAR_FINALIZAR',
            titulo: 'Agregar Multimedia',
            mensaje: mensaje,
            botones: [
                {
                    text: 'Aceptar',
                    handler: () => {
                        if(exitoso){
                            this.navController.navigateBack('/servicio-detalle');
                        }else{

                        }                        
                    }
                }
            ]
        }
        this.alertasService.presentarAlerta(opciones);
    }
}
