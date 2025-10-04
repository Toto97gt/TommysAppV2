import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(
    private navController: NavController,
    public storageService: StorageService,
  ) {}

  ngOnInit(): void {}

  mascotas(): void {
    this.navController.navigateForward('/mascota-lista');
  }

  aseo(): void {
    this.storageService.setItem('tipoProducto', 'ASEO').then(() => {
      if (this.storageService.tieneRolAseo || this.storageService.tieneRolPiloto) {
        this.navController.navigateForward('/servicio-lista');
      } else {
        this.navController.navigateForward('/tabs-servicio');
      }
    });
  }

  paseo(): void {
    this.storageService.setItem('tipoProducto', 'PASEO').then(() => {
      if (this.storageService.tieneRolAseo || this.storageService.tieneRolPiloto) {
        this.navController.navigateForward('/servicio-lista');
      } else {
        this.navController.navigateForward('/tabs-servicio');
      }
    });
  }

  notificaciones(): void {
    this.navController.navigateForward('/notificacion-lista');
  }

  actualizarUsuario(): void {
    this.storageService.setItem('usuario-navegacion', 'ACTUALIZAR');
    this.navController.navigateForward('/wizard-datos-usuario');
  }

  tiendas(): void {
    this.navController.navigateForward('/tienda-lista');
  }

  ingresar(): void {
    this.storageService.setItem('urlForward', '/tabs-inicio');
    this.navController.navigateForward('/ingreso');
  }

  Adopciones(): void {
    console.log('Ingreso exitoso a la pestaña');
    this.navController.navigateForward('/adopcion-pagina');
  }

  salir(): void {
    this.storageService.clear();
    this.navController.navigateRoot('/tabs-inicio');
  }
}