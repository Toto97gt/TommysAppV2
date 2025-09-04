import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AlertasService {

    idAlerta: any;
    alerta: any;
    loading: any;

    constructor(
        private alertController: AlertController,
        private loadingController: LoadingController
    ) { }

    async presentarAlerta(opciones: any) {
        this.idAlerta = opciones.idAlerta;
        this.alerta = await this.alertController.create({
            header: 'Tommy\'s Pet Shop',
            subHeader: opciones.titulo,
            message: opciones.mensaje,
            backdropDismiss: false,
            buttons: opciones.botones
        });
        
        await this.alerta.present();
    }

    actualizarMensajeAlerta(mensaje:any){
        if(this.estaPresenteAlerta()){
            this.alerta.message = mensaje;
        }
    }
    
    terminarAlerta(){
        if(this.estaPresenteAlerta()){
            this.alerta.dismiss();
            this.alerta = null;
        }
    }

    estaPresenteAlerta(){
        return !(this.alerta === undefined || this.alerta == null);
    }

    async presentLoading(mensaje: any) {
        this.loading = await this.loadingController.create({
            duration: 900000,
            message: mensaje
        });
        await this.loading.present();

        const { role, data } = await this.loading.onDidDismiss();
    }

    async presentLoading2(mensaje: any, duration: any) {
        this.loading = await this.loadingController.create({
            duration: duration * 1000,
            message: mensaje
        });
        await this.loading.present();

        const { role, data } = await this.loading.onDidDismiss();
    }

    async dismissLoading() {
        this.loading.dismiss();
    }

}
