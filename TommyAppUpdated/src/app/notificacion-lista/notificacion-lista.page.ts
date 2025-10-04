import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { AlertasService } from 'src/services/alertas.service';
import { ConnectionStatus, NetworkService } from 'src/services/network.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

interface Notificacion {
  urlFoto?: string;
  urlFotoSafe?: string;
  // agrega aquí otras propiedades si las necesitas (id, titulo, mensaje, fecha, etc.)
}

@Component({
  selector: 'app-notificacion-lista',
  templateUrl: './notificacion-lista.page.html',
  styleUrls: ['./notificacion-lista.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class NotificacionListaPage implements OnInit {

  notificaciones: Notificacion[] = [];
  pagina = 0;
  mostrarMas = false;

  constructor(
    private restApiService: RestApiService,
    private alertasService: AlertasService,
    private storageService: StorageService,
    private networkService: NetworkService
  ) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarNotificaciones();
  }

  iniciarDatos(): void {
    this.pagina = 0;
    this.mostrarMas = false;
    this.cargarNotificaciones();
  }

  cargarMas(): void {
    this.pagina++;
    this.cargarNotificaciones();
  }

  cargarNotificaciones(): void {
    if (this.pagina === 0) {
      this.notificaciones = [];
    }

    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
      this.alertasService.presentLoading('');
      this.storageService.getItemObject('usuario').then((usuario: any) => {
        const llamada = usuario
          ? this.restApiService.postApi('notificacion/lista', { pagina: this.pagina })
          : this.restApiService.postApiPublic('notificacion/lista', { pagina: this.pagina });

        llamada.then((respuesta: any) => {
          if (respuesta?.exitoso) {
            const registros: Notificacion[] = Array.isArray(respuesta.datos?.registros)
              ? respuesta.datos.registros
              : [];
            this.revisarArchivosLocales(registros, true);
            const total: number = Number(respuesta.datos?.total ?? 0);
            this.mostrarMas = this.notificaciones.length < total;
          } else {
            console.error('No se han podido cargar las notificaciones', respuesta);
          }
          this.alertasService.dismissLoading();
        });
      });
    } else {
      // (sin cambios) lógica offline si la agregas más adelante
    }
  }

  revisarArchivosLocales(notificaciones: Notificacion[], _guardarLocal: boolean): void {
    notificaciones.forEach((notificacion: Notificacion) => {
      notificacion.urlFotoSafe = notificacion.urlFoto;
      this.notificaciones.push(notificacion);
    });
  }
}