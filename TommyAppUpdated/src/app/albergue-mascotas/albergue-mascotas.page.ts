import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';

import { AlertasService } from 'src/services/alertas.service';
import { ConnectionStatus, NetworkService } from 'src/services/network.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-albergue-mascotas',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './albergue-mascotas.page.html',
  styleUrls: ['./albergue-mascotas.page.scss'],
})
export class AlbergueMascotasPage implements OnInit {

  mascotas: any[] = [];
  pagina = 0;
  mostrarMas = false;

  albergue: any = null;

  constructor(
    private navController: NavController,
    private alertasService: AlertasService,
    private storageService: StorageService,
    private networkService: NetworkService,
    private restApiService: RestApiService,
  ) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.storageService.getItemObject('albergue').then((albergue: any) => {
      this.albergue = albergue;
      this.iniciarDatos();
    });
  }

  iniciarDatos(): void {
    this.pagina = 0;
    this.mostrarMas = false;
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    if (this.pagina === 0) {
      this.mascotas = [];
    }

    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
      this.alertasService.presentLoading('');

      this.restApiService
        .postApiPublic('albergue/listaMascota', { idAlbergue: this.albergue.id, pagina: this.pagina })
        .then((respuesta: any) => {
          if (respuesta?.exitoso) {
            this.mascotas = respuesta.datos?.registros ?? [];
            const total = Number(respuesta.datos?.total ?? this.mascotas.length);
            this.mostrarMas = this.mascotas.length < total;
          } else {
            console.error('No se han podido cargar los peluditos.', respuesta);
          }
          this.alertasService.dismissLoading();
        })
        .catch(() => this.alertasService.dismissLoading());
    } else {
      // (sin flujo offline original)
    }
  }

  cargarMas(): void {
    this.pagina++;
    this.cargarMascotas();
  }
}