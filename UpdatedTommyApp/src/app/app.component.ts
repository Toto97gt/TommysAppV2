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

    try {
      await ScreenOrientation.lock({ orientation: 'portrait' });
    } catch (e) {
      // opcional: console.warn('No se pudo bloquear orientación', e);
    }

    try {
      if (Capacitor.getPlatform() !== 'web') {
        await StatusBar.setStyle({ style: Style.Dark });
        // opcional: await StatusBar.setBackgroundColor({ color: '#ffffff' });
      }
    } catch (e) {}

    try {
      await SplashScreen.hide();
    } catch (e) {}

    try {
      await this.permissionService.solicitarPermisoEscritura();
    } catch (e) {}

    this.fCMService.inicializar();

    this.navController.navigateRoot('/tabs-inicio');

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