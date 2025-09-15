import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AppLauncher } from '@capacitor/app-launcher';
import { Capacitor } from '@capacitor/core';

import { AlertasService } from 'src/services/alertas.service';
import { GpsService } from 'src/services/gps.service';
import { MultimediaService } from 'src/services/multimedia.service';
import { ConnectionStatus, NetworkService } from 'src/services/network.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-tienda-lista',
  templateUrl: './tienda-lista.page.html',
  styleUrls: ['./tienda-lista.page.scss'],
})
export class TiendaListaPage implements OnInit {

  tiendas: any[] = [];

  constructor(
    private platform: Platform,
    private restApiService: RestApiService,
    private alertasService: AlertasService,
    private storageService: StorageService,
    private multimediaService: MultimediaService,
    private networkService: NetworkService,
    private gpsService: GpsService
  ) {}

  ngOnInit() {
    this.cargarDetalle();
  }

  cargarDetalle() {
    this.tiendas = [];
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
      this.alertasService.presentLoading('');

      this.restApiService.postApiPublic('tienda/lista', null).then((respuesta: any) => {
        if (respuesta.exitoso) {
          this.revisarArchivosLocales(respuesta.datos.tiendas, true);
        } else {
          console.error('No se han podido cargar las tiendas', respuesta);
        }
        this.alertasService.dismissLoading();
      });
    } else {
      this.storageService.getItemObject('tiendas').then((tiendas: any) => {
        if (tiendas !== null) {
          this.revisarArchivosLocales(tiendas, false);
        } else {
          this.tiendas = [];
        }
      });
    }
  }

  /** ✅ Reemplazo de CallNumber: usa AppLauncher con esquema tel: */
  async llamar(telefono: string) {
    const url = `tel:${telefono}`;
    try {
      // En web, muchos navegadores abren tel: directamente
      if (Capacitor.getPlatform() === 'web') {
        window.location.href = url;
        return;
      }
      const can = await AppLauncher.canOpenUrl({ url });
      if (can.value) {
        await AppLauncher.openUrl({ url });
      } else {
        // Fallback suave en caso de que no pueda abrir vía plugin
        window.location.href = url;
      }
    } catch (e) {
      // Último fallback
      window.location.href = url;
    }
  }

  revisarArchivosLocales(tiendas: any[], guardarLocal: boolean) {
    this.tiendas = [];
    // Conserva la lógica original: si existe en local, usa esa URL;
    // si no, deja la remota y dispara la descarga en background.
    tiendas.forEach(tienda => {
      if (tienda.urlFoto !== undefined && tienda.urlFoto !== null) {
        this.multimediaService.existeArchivo(tienda.urlFoto).then((resultado: any) => {
          if (resultado.existe) {
            tienda.urlFoto = resultado.url;
            tienda.urlFotoSafe = resultado.urlSafe;
          } else {
            // descarga en background y mantén la URL remota visible
            this.multimediaService.descargar(tienda.urlFoto);
            tienda.urlFotoSafe = tienda.urlFoto;
          }

          this.tiendas.push(tienda);
          if (guardarLocal) {
            this.storageService.setItemObject('tiendas', this.tiendas);
          }
        });
      } else {
        this.tiendas.push(tienda);
        if (guardarLocal) {
          this.storageService.setItemObject('tiendas', this.tiendas);
        }
      }
    });
  }

  comoLlegar(latitud: number, longitud: number) {
    this.gpsService.comoLlegar(latitud, longitud);
  }
}
