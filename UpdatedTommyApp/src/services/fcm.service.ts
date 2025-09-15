import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NavController, Platform } from '@ionic/angular';
import { FCM, FCMPlugin } from "@capacitor-community/fcm";
import { PushNotifications } from '@capacitor/push-notifications';
import { RestApiService } from './restApi.service';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class FCMService {

    constructor(
        private navController: NavController,
        private fcm: any,
        private localNotifications: any,
        private platform: Platform,
        private restApiService: RestApiService,
        private storageService: StorageService
    ) { }

    async inicializar() {
        // 🚀 Pedir permisos
        const permStatus = await PushNotifications.requestPermissions();
        if (permStatus.receive === 'granted') {
        await PushNotifications.register();
        }

        // 📩 Listener cuando se recibe un push en foreground
        PushNotifications.addListener('pushNotificationReceived', async (notif) => {
        console.log('Push en foreground:', notif);

        if (this.platform.is('android') || this.platform.is('ios')) {
            await LocalNotifications.schedule({
            notifications: [
                {
                title: notif.title ?? 'Notificación',
                body: notif.body ?? '',
                id: Date.now(),
                schedule: { at: new Date(Date.now() + 1000) },
                extra: notif.data
                }
            ]
            });
        }
        });

        // 📌 Cuando el usuario toca una notificación
        PushNotifications.addListener('pushNotificationActionPerformed', (notif) => {
        console.log('Notificación clicada:', notif.notification.data);
        this.mostrarPantalla(notif.notification.data);
        });

        // 🎯 Token inicial de FCM
        this.obtenerToken();

        const { token } = await FCM.getToken();
        console.log('Token FCM:', token);

        FCM.refreshToken().then((newToken) => {
            console.log('Token FCM refrescado:', newToken.token);
            this.agregarDispositivo(newToken.token);
        });
    }

  async obtenerToken() {
    const { token } = await FCM.getToken();
    console.log('Token FCM:', token);
    this.agregarDispositivo(token);
  }

  agregarDispositivo(token: string) {
    let data: any = {
      tokenFCM: token,
      platform: this.platform.is('android') ? 'ANDROID' : 'IOS',
      idUsuario: null
    };

    this.storageService.getItemObject('usuario').then((usuario: any) => {
      if (usuario) {
        data.idUsuario = usuario.id;
      }
      this.restApiService.postApiPublic('dispositivo/agregar', data);
    });
  }

  async redireccionar() {
    // ✅ Ya no existe getInitialPushPayload en FCM
    const delivered = await PushNotifications.getDeliveredNotifications();
    console.log('Notificaciones entregadas:', delivered);

    if (delivered.notifications.length > 0) {
      this.mostrarPantalla(delivered.notifications[0].data);
    }
  }

  mostrarPantalla(pushPayload: any) {
    if (!pushPayload || !pushPayload.mostrar) return;

    switch (pushPayload.mostrar) {
      case 'SERVICIO_LISTA':
        this.storageService.setItem('tipoProducto', pushPayload.tipoProducto).then(() => {
          this.navController.navigateForward('/servicio-lista');
        });
        break;

      case 'SERVICIO_DETALLE':
        this.storageService.setItem('idServicio', pushPayload.idServicio).then(() => {
          this.storageService.setItem('tipoProducto', pushPayload.tipoProducto).then(() => {
            this.navController.navigateForward('/servicio-detalle');
          });
        });
        break;

      case 'NOTIFICACION_LISTA':
        this.navController.navigateForward('/notificacion-lista');
        break;
    }
  }
}
