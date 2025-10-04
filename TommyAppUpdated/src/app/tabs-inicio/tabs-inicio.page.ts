import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonTabs, IonicModule } from '@ionic/angular';

import { FCMService } from 'src/services/fcm.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-tabs-inicio',
  standalone: true,
  templateUrl: './tabs-inicio.page.html',
  styleUrls: ['./tabs-inicio.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule],
})
export class TabsInicioPage implements OnInit {
  @ViewChild('tabs', { static: true }) tabsRef!: IonTabs;

  constructor(
    private fCMService: FCMService,
    private restApiService: RestApiService,
    public storageService: StorageService
  ) {
    this.fCMService.redireccionar();
  }

  ngOnInit(): void {
    this.fCMService.obtenerToken();

    this.storageService.getItem('token').then((token: string | null) => {
      if (token !== null) {
        this.restApiService.actualizarDatosUsuario();
      }
    });
  }

  // Lifecycle de Ionic: se sigue llamando igual en standalone
  ionViewWillEnter(): void {
    this.restApiService.verificarEstadoUsuario();
  }
}