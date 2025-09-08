import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertasService } from 'src/services/alertas.service';
import { GpsService } from 'src/services/gps.service';
import { ConnectionStatus, NetworkService } from 'src/services/network.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
    selector: 'app-albergue-mascotas',
    templateUrl: './albergue-mascotas.page.html',
    styleUrls: ['./albergue-mascotas.page.scss'],
})
export class AlbergueMascotasPage implements OnInit {

    mascotas = [];
    pagina = 0;
    mostrarMas = false;

    albergue;

    constructor(
        private navController: NavController,
        private alertasService: AlertasService,
        private storageService: StorageService,
        private networkService: NetworkService,
        private restApiService: RestApiService,
        private gpsService: GpsService
    ) { }

    ngOnInit() {}

    ionViewWillEnter() {
        this.storageService.getItemObject('albergue').then((albergue: any) => {
            this.albergue = albergue;
            this.iniciarDatos();
        });
    }

    iniciarDatos() {
        this.pagina = 0;
        this.mostrarMas = false;
        this.cargarMascotas();
    }

    cargarMascotas() {
        if(this.pagina == 0){
            this.mascotas = [];
        }
        if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
            this.alertasService.presentLoading('');

            this.restApiService.postApiPublic('albergue/listaMascota', { idAlbergue: this.albergue.id, pagina: this.pagina }).then((respuesta: any) =>{    
                if (respuesta.exitoso) {
                    this.mascotas = respuesta.datos.registros;
                } else {
                    console.error('No se han podido cargar los peluditos.', respuesta);
                }
                this.alertasService.dismissLoading();
            });
        } else {
           
        }
    }

    cargarMas() {
        this.pagina++;
        this.cargarMascotas();
    }

}
