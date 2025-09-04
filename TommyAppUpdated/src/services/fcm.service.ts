import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NavController, Platform } from '@ionic/angular';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { RestApiService } from './restApi.service';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class FCMService {

    constructor(
        private navController: NavController,
        private fcm: FCM,
        private localNotifications: LocalNotifications,
        private platform: Platform,
        private restApiService: RestApiService,
        private storageService: StorageService
    ) { }

    inicializar() {
        this.fcm.requestPushPermission();

        this.fcm.onNotification().subscribe(data => {
            console.log('FCM Data', data);
            
            if (data.wasTapped) {
                console.log('FCM Received in background', data);

                this.mostrarPantalla(data);
            } else {
                console.log('FCM Received in foreground', data);

                if ( this.platform.is('android') || (this.platform.is('ios') && data.data === undefined) ) {

                    this.localNotifications.schedule({
                        title: data.title,
                        text: data.body,
                        data: data,
                        foreground: true
                    });

                    this.localNotifications.on('click').subscribe(notificationReceived => {
                        console.log('localNotifications notificationReceived;', notificationReceived);
                        
                        this.mostrarPantalla(notificationReceived.data);
                    });
                }
            };
        });
        this.obtenerToken();
        
    }

    obtenerToken() {
        this.fcm.getToken().then(token => {
            this.agregarDispositivo(token);
        });

        this.fcm.onTokenRefresh().subscribe(token => {
            this.agregarDispositivo(token);
        });
    }

    agregarDispositivo(token) {
        let data = {
            tokenFCM: token,
            platform: this.platform.is('android') ? "ANDROID" : "IOS",
            idUsuario: null
        }

        this.storageService.getItemObject('usuario').then((usuario: any) => {
            if(usuario !== undefined && usuario !== null){
                data.idUsuario = usuario.id;
            }
            this.restApiService.postApiPublic('dispositivo/agregar', data).then(resultado => {

            });
        });
    }

    redireccionar(){
        this.fcm.getInitialPushPayload().then(pushPayload => {
            console.log('FCM PushPayload', pushPayload);
            
            this.mostrarPantalla(pushPayload);
        });
    }

    mostrarPantalla(pushPayload){
        console.log('FCM PushPayload', pushPayload);

        if(pushPayload !== undefined && pushPayload !== null && pushPayload.mostrar !== undefined && pushPayload.mostrar !== null){
            if(pushPayload.mostrar === 'SERVICIO_LISTA'){
                this.storageService.setItem('tipoProducto', pushPayload.tipoProducto).then(resultado =>{
                    this.navController.navigateForward('/servicio-lista');
                });
            }else if(pushPayload.mostrar === 'SERVICIO_DETALLE'){
                this.storageService.setItem('idServicio', pushPayload.idServicio).then(resultado =>{
                    this.storageService.setItem('tipoProducto', pushPayload.tipoProducto).then(resultado =>{
                        this.navController.navigateForward('/servicio-detalle');
                    });
                });
            }else if(pushPayload.mostrar === 'NOTIFICACION_LISTA'){
                this.navController.navigateForward('/notificacion-lista');
            }
        }
    }
}
