import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {

    private estadoPermisos = 'ninguno';

    constructor(private androidPermissions: AndroidPermissions) { }

    getPermisosCorrectos() {
        return new Promise((resolve, reject) => {
            if (this.estadoPermisos === 'ninguno') {
                this.estadoPermisos = 'solicitando';
                this.solicitarPermisos().then(() => {
                    this.estadoPermisos = 'correcto';
                    resolve(true);
                }, () => {
                    this.estadoPermisos = 'rechazado';
                    reject(false);
                });
            } else if (this.estadoPermisos === 'solicitando') {
                this.wait(10 * 1000).then(() => {
                    if (this.estadoPermisos === 'correcto') {
                        resolve(true);
                    } else if (this.estadoPermisos === 'rechazo') {
                        reject(false);
                    } else {
                        reject(false);
                    }
                });
            } else if (this.estadoPermisos === 'correcto') {
                resolve(true);
            } else if (this.estadoPermisos === 'rechazado') {
                reject(false);
            }
        });
    }

    solicitarPermiso(permission) {
        return new Promise(resolve => {
            this.androidPermissions.checkPermission(permission).then(result => {
                if (!result.hasPermission) {
                    this.androidPermissions.requestPermission(permission).then(requestResult => {
                        if (requestResult.hasPermission) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }).catch(error => {
                        console.error('RequestPermission:', error);
                        resolve(false);
                    });
                } else {
                    resolve(true);
                }
            }).catch(err => {
                this.androidPermissions.requestPermission(permission).then(requestResult => {
                    if (requestResult.hasPermission) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }).catch(error => {
                    console.error('RequestPermission:', error);
                    resolve(false);
                });
            });
        });
    }

    solicitarPermisos(){
        return new Promise(resolve => {
            this.solicitarPermisoEscritura().then(result => {
               resolve(result);
            });
        });
    }

    solicitarPermisoEscritura() {
        return new Promise(resolve => {
            this.solicitarPermiso(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(result => {
               resolve(result);
            });
        });
    }

    solicitarPermisosUbicacion() {
        return new Promise((resolve, reject) => {
            this.solicitarPermiso(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(result =>{
                resolve(result);
            });
            this.solicitarPermiso(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
            this.solicitarPermiso(this.androidPermissions.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS);
        });
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}
