import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

declare var SignalStrength: any;

export enum ConnectionStatus {
    Online,
    Offline
}

@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

    constructor(
        private network: Network, 
        private toastController: ToastController,
        private platform: Platform
    ) {
        this.platform.ready().then(() => {
            this.initializeNetworkEvents();
            let tipoConexionValido = this.network.type === 'wifi';
            tipoConexionValido = tipoConexionValido || this.network.type === '4g';
            tipoConexionValido = tipoConexionValido || this.network.type === '3g';
            if (tipoConexionValido) {
                this.status.next(ConnectionStatus.Online);
            } else {
                this.status.next(ConnectionStatus.Offline);
            }
        });
    }

    sinalStrength() {
        return new Promise(resolve => {
            SignalStrength.dbm((measuredDbm) => {
                resolve(measuredDbm);
            });
        });
    }

    initializeNetworkEvents() {
        this.network.onDisconnect().subscribe(() => {
            if (this.status.getValue() === ConnectionStatus.Online) {
                this.updateNetworkStatus(ConnectionStatus.Offline);
            }
        });

        this.network.onConnect().subscribe(() => {
            if (this.status.getValue() === ConnectionStatus.Offline) {
                this.updateNetworkStatus(ConnectionStatus.Online);
            }
        });
    }

    private async updateNetworkStatus(status: ConnectionStatus) {
        this.status.next(status);

        const connection = status === ConnectionStatus.Offline ? 'Offline' : 'Online';
        const toast = this.toastController.create({
            message: `Trabajando en modo ${connection}`,
            duration: 2000,
            position: 'bottom'
        });
        // toast.then(toastMessage => toastMessage.present());
    }

    onNetworkChange(): Observable<ConnectionStatus> {
        return this.status.asObservable();
    }

    getCurrentNetworkStatus(): ConnectionStatus {
        return this.status.getValue();
    }
}