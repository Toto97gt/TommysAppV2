import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private idUser = '';
  private _storage: Storage | null = null;

  tieneRolCliente = false;
  tieneRolAseo = false;
  tieneRolPiloto = false;
  autenticado = false;
  usuario: any = null;

  constructor(private storage: Storage) {
    this.init();
  }

  /** Inicializa el storage antes de usarlo */
  private async init() {
    this._storage = await this.storage.create();
  }

  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      return await this._storage?.get(key) ?? null;
    } catch {
      return null;
    }
  }

  async getItemObject<T = any>(key: string): Promise<T | null> {
    try {
      const val = await this._storage?.get(key);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  }

  async setItem(key: string, value: any): Promise<boolean> {
    try {
      await this._storage?.set(key, value);
      return true;
    } catch {
      return false;
    }
  }

  async setItemObject(key: string, value: any): Promise<boolean> {
    try {
      await this._storage?.set(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  async removeItem(key: string): Promise<boolean> {
    try {
      await this._storage?.remove(key);
      return true;
    } catch {
      return false;
    }
  }

  async clear(): Promise<boolean> {
    this.idUser = '';
    this.usuario = null;
    this.tieneRolCliente = false;
    this.tieneRolAseo = false;
    this.tieneRolPiloto = false;
    this.autenticado = false;

    try {
      await this._storage?.clear();
      return true;
    } catch {
      return false;
    }
  }

  iniciarSesion(datos: any) {
    this.idUser = datos.usuario.id;
    this.usuario = datos.usuario;
    this.tieneRolCliente = false;
    this.tieneRolAseo = false;
    this.tieneRolPiloto = false;
    this.autenticado = true;

    if (datos.roles) {
      const roles = datos.roles.split(',');
      roles.forEach((rol: any) => {
        if (rol === 'ROLE_CLIENTE') this.tieneRolCliente = true;
        if (rol === 'ROLE_ASEO') this.tieneRolAseo = true;
        if (rol === 'ROLE_PILOTO') this.tieneRolPiloto = true;
      });
    }
  }
}
