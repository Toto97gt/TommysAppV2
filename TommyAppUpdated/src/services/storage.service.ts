import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private idUser = '';

    tieneRolCliente = false;
    tieneRolAseo = false;
    tieneRolPiloto = false;
    autenticado = false;
    usuario = null;

    constructor(private storage: Storage) {}

    getItem(key: string) {
        return new Promise(resolve => {
            this.storage.get(key).then((val: any) =>{
                resolve(val);
            }).catch(error => {
                resolve(null);
            });

            // resolve(localStorage.getItem(key + this.idUser));
        });

    }

    getItemObject(key: string) {
        return new Promise(resolve => {
            this.storage.get(key).then((val: any) =>{
                resolve(JSON.parse(val));
            }).catch(error => {
                resolve(null);
            });

            // resolve(JSON.parse(localStorage.getItem(key + this.idUser)));
        });

    }

    setItem(key: string, value: any) {
        return new Promise(resolve => {
            this.storage.set(key, value).then((val: any) =>{
                resolve(true);
            }).catch(error => {
                resolve(false);
            });

            // localStorage.setItem(key + this.idUser, value);
            // resolve(true);
        });
    }

    setItemObject(key: string, value: any) {
        return new Promise(resolve => {
            this.storage.set(key, JSON.stringify(value)).then((val: any) =>{
                resolve(true);
            }).catch(error => {
                resolve(false);
            });

            // localStorage.setItem(key + this.idUser, JSON.stringify(value));
            // resolve(true);
        });
    }

    removeItem(key: string) {
        return new Promise(resolve => {
            this.storage.remove(key).then((val: any) =>{
                resolve(true);
            }).catch(error => {
                resolve(false);
            });

            // localStorage.removeItem(key + this.idUser);
            // resolve(true);
        });
    }

    clear() {
        this.idUser = '';
        this.usuario = null;
        this.tieneRolCliente = false;
        this.tieneRolAseo = false;
        this.tieneRolPiloto = false;
        this.autenticado = false;

        return new Promise(resolve => {
            this.storage.clear().then((val: any) =>{
                resolve(true);
            }).catch(error => {
                resolve(false);
            });

            // localStorage.clear();
            // resolve(true);
        });
    }

    iniciarSesion(datos){
        this.idUser = datos.usuario.id;
        this.usuario = datos.usuario;
        this.tieneRolCliente = false;
        this.tieneRolAseo = false;
        this.tieneRolPiloto = false;
        this.autenticado = true;
        
        if(datos.roles !== undefined && datos.roles !== null){
            let roles = datos.roles.split(',');
            roles.forEach(rol => {
                if(rol === 'ROLE_CLIENTE'){
                    this.tieneRolCliente = true;
                }
                if(rol === 'ROLE_ASEO'){
                    this.tieneRolAseo = true;
                }
                if(rol === 'ROLE_PILOTO'){
                    this.tieneRolPiloto = true;
                }
            });
        }
    }
}
