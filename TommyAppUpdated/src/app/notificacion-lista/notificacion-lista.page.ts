import { Component, OnInit } from '@angular/core';
import { AlertasService } from 'src/services/alertas.service';
import { ConnectionStatus, NetworkService } from 'src/services/network.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
    selector: 'app-notificacion-lista',
    templateUrl: './notificacion-lista.page.html',
    styleUrls: ['./notificacion-lista.page.scss'],
})
export class NotificacionListaPage implements OnInit {

    notificaciones = [];
    pagina = 0;
    mostrarMas = false;

    constructor(
        private restApiService: RestApiService,
        private alertasService: AlertasService,
        private storageService: StorageService,
        private networkService: NetworkService
    ) { }

    ngOnInit() {}

    ionViewWillEnter() {
        this.cargarNotificaciones();
    }

    iniciarDatos(){
        this.pagina = 0;
        this.mostrarMas = false;
        this.cargarNotificaciones();
    }

    cargarMas() {
        this.pagina++;
        this.cargarNotificaciones();
    }

    cargarNotificaciones() {
        if(this.pagina == 0){
            this.notificaciones = [];
        }

        if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
            this.alertasService.presentLoading('');
            this.storageService.getItemObject('usuario').then((usuario: any) => {
                if (usuario !== undefined && usuario !== null) {
                    this.restApiService.postApi('notificacion/lista', {pagina: this.pagina }).then((respuesta: any) => {
                        if (respuesta.exitoso) {
                            this.revisarArchivosLocales(respuesta.datos.registros, true);
                            this.mostrarMas = this.notificaciones.length < respuesta.datos.total;
                        } else {
                            console.error('No se han podido cargar las notificaciones', respuesta);
                        }
                        this.alertasService.dismissLoading();
                    });
                } else {
                    this.restApiService.postApiPublic('notificacion/lista', {pagina: this.pagina }).then((respuesta: any) => {
                        if (respuesta.exitoso) {
                            this.revisarArchivosLocales(respuesta.datos.registros, true);
                            this.mostrarMas = this.notificaciones.length < respuesta.datos.total;
                        } else {
                            console.error('No se han podido cargar las notificaciones', respuesta);
                        }
                        this.alertasService.dismissLoading();
                    });
                }

                
            });
        } else {

        }
    }

    revisarArchivosLocales(notificaciones, guardarLocal){
        notificaciones.forEach(notificacion => {
            notificacion.urlFotoSafe = notificacion.urlFoto;
            this.notificaciones.push(notificacion);
        });
    }

}
