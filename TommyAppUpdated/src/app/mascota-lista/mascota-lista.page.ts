import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AlertasService } from 'src/services/alertas.service';
import { MascotaService } from 'src/services/mascota.service';
import { ConnectionStatus, NetworkService } from 'src/services/network.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-mascota-lista',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './mascota-lista.page.html',
  styleUrls: ['./mascota-lista.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MascotaListaPage implements OnInit {

  mascotas: any[] = [];
  aseos: number | null = null;
  paseos: number | null = null;

  constructor(
    private navController: NavController,
    private alertasService: AlertasService,
    private storageService: StorageService,
    private networkService: NetworkService,
    private mascotaService: MascotaService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.storageService.getItemObject('cantidadGratis').then((cantidadGratis: any) => {
      if (cantidadGratis) {
        this.aseos = (cantidadGratis.aseos - 1);
        this.paseos = (cantidadGratis.paseos - 1);
      }

      if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
        this.alertasService.presentLoading('');
        this.mascotaService.obtenerMascotas().then((mascotasLista: any) => {
          this.mascotas = mascotasLista;
          this.alertasService.dismissLoading();
        });
      } else {
        this.storageService.getItemObject('mascotas').then((mascotas: any) => {
          this.mascotas = mascotas || [];
        });
      }
    });
  }

  goAgregar() {
    this.storageService.setItem('mascota-navegacion', 'AGREGAR');
    this.storageService.removeItem('mascota');
    this.navController.navigateForward('/wizard-datos-mascota');
  }

  goActualizar(mascota: any) {
    this.storageService.setItem('mascota-navegacion', 'ACTUALIZAR');
    this.storageService.setItemObject('mascota', mascota);
    this.navController.navigateForward('/wizard-datos-mascota');
  }
}