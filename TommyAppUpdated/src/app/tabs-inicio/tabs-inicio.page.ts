import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { FCMService } from 'src/services/fcm.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
    selector: 'app-tabs-inicio',
    templateUrl: './tabs-inicio.page.html',
    styleUrls: ['./tabs-inicio.page.scss'],
})
export class TabsInicioPage implements OnInit {

    @ViewChild('tabs', { static: true }) tabsRef!: IonTabs;

    constructor(
        private fCMService: FCMService,
        private restApiService: RestApiService,
        public storageService: StorageService,
    ) {
        this.fCMService.redireccionar();
    }

    ngOnInit() {
        this.fCMService.obtenerToken();
        this.storageService.getItem('token').then(token => {
            if (token !== null) {
                this.restApiService.actualizarDatosUsuario()
            }
        });
    }

    ionViewWillEnter() {
        this.restApiService.verificarEstadoUsuario();
    }

}
