import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Platform } from '@ionic/angular';
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

    tiendas = [];

    constructor(
        private platform: Platform,
        private callNumber: CallNumber,
        private restApiService: RestApiService,
        private alertasService: AlertasService,
        private storageService: StorageService,
        private multimediaService: MultimediaService,
        private networkService: NetworkService,
        private gpsService: GpsService
    ) { }

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
                if(tiendas !== null){
                    this.revisarArchivosLocales(tiendas, false);
                }else{
                    this.tiendas = [];
                }
            });
        }
    }

    llamar(telefono: string){
        this.callNumber.callNumber(telefono.toString(), true);
    }

    revisarArchivosLocales(tiendas, guardarLocal){
        this.tiendas = [];
        tiendas.forEach(tienda => {
            if(tienda.urlFoto !== undefined && tienda.urlFoto  !== null){
                this.multimediaService.existeArchivo(tienda.urlFoto).then((resultado: any) =>{
                    if(resultado.existe){
                        tienda.urlFoto = resultado.url;
                        tienda.urlFotoSafe = resultado.urlSafe;
                    }else{
                        this.multimediaService.descargar(tienda.urlFoto);
                        tienda.urlFotoSafe = tienda.urlFoto;
                    }

                    this.tiendas.push(tienda);
                    if (guardarLocal) {
                        this.storageService.setItemObject('tiendas', this.tiendas);
                    }
                });
            }else{

                this.tiendas.push(tienda);
                if (guardarLocal) {
                    this.storageService.setItemObject('tiendas', this.tiendas);
                }
            }
        });
    }

    comoLlegar(latitud, longitud) {
        this.gpsService.comoLlegar(latitud, longitud);
    }

}
