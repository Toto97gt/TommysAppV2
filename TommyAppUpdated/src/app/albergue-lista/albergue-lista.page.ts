import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { NavController } from '@ionic/angular';
import { AlertasService } from 'src/services/alertas.service';
import { GpsService } from 'src/services/gps.service';
import { ConnectionStatus, NetworkService } from 'src/services/network.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
    selector: 'app-albergue-lista',
    templateUrl: './albergue-lista.page.html',
    styleUrls: ['./albergue-lista.page.scss'],
})
export class AlbergueListaPage implements OnInit {

    albergues = [];

    constructor(
        private navController: NavController,
        private callNumber: CallNumber,
        private alertasService: AlertasService,
        private storageService: StorageService,
        private networkService: NetworkService,
        private restApiService: RestApiService,
        private gpsService: GpsService
    ) { }

    ngOnInit() {
    }

    ionViewWillEnter(){
        this.albergues = [];
        if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
            this.alertasService.presentLoading('');

            this.restApiService.postApiPublic('albergue/lista', null).then((respuesta: any) => {
                if (respuesta.exitoso) {
                    this.albergues = respuesta.datos.albergues;
                } else {
                    console.error('No se han podido cargar los albergues', respuesta);
                }

                this.alertasService.dismissLoading();
            });
        } else {
            this.storageService.getItemObject('albergues').then((albergues: any) => {
                if(albergues !== null){
                    this.albergues = albergues;
                }else{
                    this.albergues = [];
                }
            });
        }
    }

    goListaMascotas(albergue){
        this.storageService.setItemObject('albergue', albergue).then(resultado => {
            this.navController.navigateForward('/albergue-mascotas');    
        });
    }

    comoLlegar(latitud, longitud) {
        this.gpsService.comoLlegar(latitud, longitud);
    }

    llamar(telefono: string){
        this.callNumber.callNumber(telefono.toString(), true);
    }
}
