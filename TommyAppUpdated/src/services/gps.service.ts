import { Injectable } from '@angular/core';
import { AppLauncher } from '@capacitor/app-launcher';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';
import { PermissionService } from 'src/services/permission.service';

@Injectable({
    providedIn: 'root'
})
export class GpsService {

    constructor(
        private platform: Platform,
        private permissionService: PermissionService
    ) { }

    async obtenerPosicion(): Promise<GeolocationCoordinates> {
    try {
      const posicion = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0
      });

      console.log(posicion);

      if (posicion.coords.accuracy <= 20) {
        return posicion.coords as GeolocationCoordinates;
      } else {
        throw new Error('Posición con baja precisión');
      }
    } catch (err: any) {
      throw err;
    }
  }

  async comoLlegar(latitud: number, longitud: number): Promise<void> {
    if (this.platform.is('ios')) {
      try {
        const url = `https://waze.com/ul?ll=${latitud},${longitud}&navigate=yes`;
        await AppLauncher.openUrl({ url });
      } catch {
        const url = `http://maps.apple.com/?t=k&ll=${latitud},${longitud}`;
        await AppLauncher.openUrl({ url });
      }
    } else {
      const url = `google.navigation:q=${latitud},${longitud}`;
      await AppLauncher.openUrl({ url });
    }
  }
}
