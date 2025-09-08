import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/services/storage.service';

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.page.html',
    styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

    constructor(
        private navController: NavController,
        public storageService: StorageService,
    ) {}

    ngOnInit() {}

    mascotas() {
        this.navController.navigateForward('/mascota-lista');
    }

    aseo() {
        this.storageService.setItem('tipoProducto', 'ASEO').then(resultado =>{
            if (this.storageService.tieneRolAseo || this.storageService.tieneRolPiloto) {
                this.navController.navigateForward('/servicio-lista');
            } else {
                this.navController.navigateForward('/tabs-servicio');
            }
        });
    }

    paseo() {
        this.storageService.setItem('tipoProducto', 'PASEO').then(resultado =>{
            if (this.storageService.tieneRolAseo || this.storageService.tieneRolPiloto) {
                this.navController.navigateForward('/servicio-lista');
            } else {
                this.navController.navigateForward('/tabs-servicio');
            }
        });
    }

    notificaciones() {
        this.navController.navigateForward('/notificacion-lista');
    }

    actualizarUsuario() {
        this.storageService.setItem('usuario-navegacion', 'ACTUALIZAR');
        this.navController.navigateForward('/wizard-datos-usuario');
    }

    tiendas() {
        this.navController.navigateForward('/tienda-lista');
    }

    ingresar() {
        this.storageService.setItem('urlForward', '/tabs-inicio');
        this.navController.navigateForward('/ingreso');
    }

    Adopciones(){
        console.log("Ingreso exitoso a la pestaña");
        this.navController.navigateForward('/adopcion-pagina');
    }

    salir() {
        this.storageService.clear();
        this.navController.navigateRoot('/tabs-inicio');
    }

}
