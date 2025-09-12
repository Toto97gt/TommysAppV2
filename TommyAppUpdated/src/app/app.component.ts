// src/app/app.component.ts
import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from '@capacitor/core';

import { FCMService } from 'src/services/fcm.service';
import { PermissionService } from 'src/services/permission.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private navController: NavController,
    private restApiService: RestApiService,
    private fCMService: FCMService,
    private storageService: StorageService,
    private permissionService: PermissionService
  ) {
    this.initializeApp();
  }

  private async initializeApp() {
    await this.platform.ready();

    // Bloquear orientación a vertical
    try {
      await ScreenOrientation.lock({ orientation: 'portrait' });
    } catch (e) {
      // opcional: console.warn('No se pudo bloquear orientación', e);
    }

    // Estilo de la barra de estado
    try {
      if (Capacitor.getPlatform() !== 'web') {
        await StatusBar.setStyle({ style: Style.Dark }); // o Style.Light según tu theme
        // opcional: await StatusBar.setBackgroundColor({ color: '#ffffff' });
      }
    } catch (e) {}

    // Ocultar splash (si no usas autoHide en capacitor.config)
    try {
      await SplashScreen.hide();
    } catch (e) {}

    // Permiso de archivos (sandbox) para mantener tu flujo
    try {
      await this.permissionService.solicitarPermisoEscritura();
    } catch (e) {}

    // Inicializa notificaciones (tu servicio ya migrado a Push)
    this.fCMService.inicializar();

    // Navega al inicio
    this.navController.navigateRoot('/tabs-inicio');

    // Si quieres reactivar el chequeo de token/actualización de usuario:
    // const token = await this.storageService.getItemOri('token');
    // if (token) {
    //   try {
    //     const resultado: any = await this.restApiService.actualizarDatosUsuario();
    //     if (resultado?.exitoso) {
    //       this.fCMService.inicializar();
    //       this.navController.navigateRoot('/tabs-inicio');
    //     } else {
    //       this.navController.navigateRoot('/ingreso');
    //     }
    //   } catch {
    //     this.navController.navigateRoot('/ingreso');
    //   }
    // } else {
    //   this.navController.navigateRoot('/ingreso');
    // }
  }
}