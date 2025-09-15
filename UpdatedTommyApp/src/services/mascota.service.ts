import { Injectable } from '@angular/core';
import { MultimediaService } from './multimedia.service';
import { ConnectionStatus, NetworkService } from './network.service';
import { RestApiService } from './restApi.service';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class MascotaService {

    idAlerta: any;
    alerta: any;
    loading: any;

    constructor(
        private storageService: StorageService,
        private restApiService: RestApiService,
        private networkService: NetworkService,
        private multimediaService: MultimediaService
    ) { }

    obtenerMascotas() {
        return new Promise((resolve, reject) => {
            if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online && this.storageService.autenticado) {
                this.restApiService.postApi('mascota/lista', {}).then((respuesta: any) => {
                    if (respuesta.exitoso) {
                        this.revisarArchivosLocales(respuesta.datos.mascotas);
                        
                        resolve(respuesta.datos.mascotas);
                    } else {
                        console.error('No se han podido cargar los peluditos.', respuesta);
                        resolve([]);
                    }
                });
            } else {
                resolve([]);
            }
        });
    }

    revisarArchivosLocales(mascotas:any) {
        let mascotasList: any[] = [];
        mascotas.forEach((mascota:any) => {
            if (mascota.urlFoto !== undefined && mascota.urlFoto  !== null) {
                this.multimediaService.existeArchivo(mascota.urlFoto).then((resultado: any) =>{
                    if (resultado.existe) {
                        mascota.urlFoto = resultado.url;
                        mascota.urlFotoSafe = resultado.urlSafe;
                    } else {
                        this.multimediaService.descargar(mascota.urlFoto);
                        mascota.urlFotoSafe = mascota.urlFoto;
                    }
                    mascotasList.push(mascota);
                });
            } else {
                mascotasList.push(mascota);
            }
        });

        this.storageService.setItemObject('mascotas', mascotasList);
    }

}
