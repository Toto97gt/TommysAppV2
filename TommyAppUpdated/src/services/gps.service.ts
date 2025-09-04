import { Injectable } from '@angular/core';
import { AppLauncher } from '@ionic-native/app-launcher/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { PermissionService } from 'src/services/permission.service';

@Injectable({
    providedIn: 'root'
})
export class GpsService {

    constructor(
        private geolocation: Geolocation,
        private appLauncher: AppLauncher,
        private platform: Platform,
        private permissionService: PermissionService
    ) { }

    obtenerPosicion() {
        return new Promise((resolve, reject) => {
            // this.permissionService.solicitarPermisosUbicacion().then(result => {
                this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }).then((posicion: any) => {
                    console.log(posicion);
                    
                    if (posicion.coords.accuracy <= 20) {
                        resolve(posicion.coords);
                    } else {
                        reject(posicion);
                    }
                }).catch((err) => {
                    reject(err);
                });
            // });
        });
    }

    comoLlegar(latitud, longitud) {
        if (this.platform.is('ios')) {
            let url = 'https://waze.com/ul?ll=' + latitud + ',' + longitud + '&navigate=yes';
            this.appLauncher.launch({
                uri: url
            }).catch(error => {
                let url = 'http://maps.apple.com/?t=k&ll=' + latitud + ',' + longitud;
                this.appLauncher.launch({
                    uri: url
                });
            });
        } else {
            let url = 'google.navigation:q=' + latitud + ',' + longitud;
            this.appLauncher.launch({
                uri: url
            });
        }
    }
}
