import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/services/storage.service';

@Component({
    selector: 'app-servicio-terminos',
    templateUrl: './servicio-terminos.page.html',
    styleUrls: ['./servicio-terminos.page.scss'],
})
export class ServicioTerminosPage implements OnInit {

    terminos: any;

    constructor(
        private storageService: StorageService,
    ) { }

    ngOnInit() {
        this.storageService.getItem('terminos').then((terminos: any) => {
            this.terminos = terminos;
        });
    }

}
