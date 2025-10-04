import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { AppLauncher } from '@capacitor/app-launcher';
import { Capacitor } from '@capacitor/core';

import { AlertasService } from 'src/services/alertas.service';
import { GpsService } from 'src/services/gps.service';
import { ConnectionStatus, NetworkService } from 'src/services/network.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  standalone: true,
  selector: 'app-albergue-lista',
  templateUrl: './albergue-lista.page.html',
  styleUrls: ['./albergue-lista.page.scss'],
  imports: [CommonModule, IonicModule],
})
export class AlbergueListaPage implements OnInit {
  albergues: any[] = [];

  constructor(
    private navController: NavController,
    private alertasService: AlertasService,
    private storageService: StorageService,
    private networkService: NetworkService,
    private restApiService: RestApiService,
    private gpsService: GpsService
  ) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.albergues = [];

    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
      this.alertasService.presentLoading('');

      this.restApiService.postApiPublic('albergue/lista', null).then((respuesta: any) => {
        if (respuesta?.exitoso) {
          this.albergues = respuesta.datos?.albergues ?? [];
        } else {
          console.error('No se han podido cargar los albergues', respuesta);
        }
        this.alertasService.dismissLoading();
      });
    } else {
      this.storageService.getItemObject('albergues').then((albergues: any) => {
        this.albergues = Array.isArray(albergues) ? albergues : [];
      });
    }
  }

  goListaMascotas(albergue: any): void {
    this.storageService.setItemObject('albergue', albergue).then(() => {
      this.navController.navigateForward('/albergue-mascotas');
    });
  }

  comoLlegar(latitud: number, longitud: number): void {
    this.gpsService.comoLlegar(latitud, longitud);
  }

  async llamar(telefono: string): Promise<void> {
    const url = `tel:${telefono}`;
    try {
      if (Capacitor.getPlatform() === 'web') {
        window.location.href = url;
        return;
      }
      const can = await AppLauncher.canOpenUrl({ url });
      if (can.value) {
        await AppLauncher.openUrl({ url });
      } else {
        window.location.href = url;
      }
    } catch {
      window.location.href = url;
    }
  }
}