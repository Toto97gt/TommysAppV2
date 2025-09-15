import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
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
  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject<ConnectionStatus>(ConnectionStatus.Offline);

  constructor(
    private toastController: ToastController,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.initializeNetworkEvents();
      this.checkInitialStatus();
    });
  }

  /** ✅ Reemplazo de network.type */
  private async checkInitialStatus() {
    const status = await Network.getStatus();
    this.status.next(status.connected ? ConnectionStatus.Online : ConnectionStatus.Offline);
  }

  /** ✅ Reemplazo de this.network.onConnect / onDisconnect */
  private initializeNetworkEvents() {
    Network.addListener('networkStatusChange', async (status) => {
      if (status.connected) {
        this.updateNetworkStatus(ConnectionStatus.Online);
      } else {
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });
  }

  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);

    const connection = status === ConnectionStatus.Offline ? 'Offline' : 'Online';
    const toast = await this.toastController.create({
      message: `Trabajando en modo ${connection}`,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  /** ✅ Igual que antes */
  onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }

  getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }
}