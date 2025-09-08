import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { AlertasService } from 'src/services/alertas.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
    selector: 'app-solicitar-contrasenia',
    templateUrl: './solicitar-contrasenia.page.html',
    styleUrls: ['./solicitar-contrasenia.page.scss'],
})
export class SolicitarContraseniaPage implements OnInit {

    solicitarForm: FormGroup;
    cambiarForm: FormGroup;
    
    mostrarSolicitarForm = true;
    
    loading;

    constructor(
        private navController: NavController,
        private form: FormBuilder,
        private alertasService: AlertasService,
        private restApiService: RestApiService,
        private storageService: StorageService
    ) { }

    ngOnInit() {
        this.cambiarForm = this.form.group({
            'password': ['', Validators.required],
            'passwordConfirm': ['', Validators.required],
        },
        {
            validator: this.matchingPasswords('password', 'passwordConfirm')
        });

        this.solicitarForm = this.form.group({'correo': ['', Validators.required]});

        this.storageService.getItem('contrasenia').then(resultado =>{
            this.mostrarSolicitarForm = resultado == 'SOLICITAR';
        });
    }

    matchingPasswords(passwordKey, passwordConfirmKey) {
        return (group: FormGroup): { [key: string]: any } => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[passwordConfirmKey];

            if (password.value !== confirmPassword.value) {
                return {
                    mismatchedPasswords: true
                };
            }
        }
    }

    solicitar() {
        this.alertasService.presentLoading('');

        let formData = {
            correo: this.solicitarForm.get('correo').value
        };
        this.restApiService.solicitarContrasenia(formData).then((respuesta: any) => {
            if (respuesta.exitoso) {
                this.alertaSolicitar('Se ha enviado una contraseña temporal a tu correo.', true);
            } else {
                this.alertaSolicitar(respuesta.mensaje, false);
            }

            this.alertasService.dismissLoading();
        });
    }

    cambiar() {
        this.alertasService.presentLoading('');

        let datos = {
            password: this.cambiarForm.get('password').value
        };
        this.restApiService.postApi('usuario/cambiarContrasenia', datos).then((respuesta: any) => {
            if (respuesta.exitoso) {
                this.alertaCambiar('Contraseña cambiada exitosamente!', true);
            } else {
                this.alertaCambiar(respuesta.mensaje, false);
            }

            this.alertasService.dismissLoading();
        });
    }

    cancelar() {
        this.navController.navigateForward('/ingreso');
    }

    alertaSolicitar(mensaje, exitoso) {
        let opciones = {
            idAlert: 'CONSTRASENIA',
            titulo: 'Solicitar Contraseña',
            mensaje: mensaje,
            botones: [
                {
                    text: 'Aceptar',
                    handler: () => {
                        if(exitoso){
                            this.navController.navigateBack('/ingreso');
                        }
                    }
                }
            ]
        }
        this.alertasService.presentarAlerta(opciones);
    }

    alertaCambiar(mensaje, exitoso) {
        let opciones = {
            idAlert: 'CONSTRASENIA',
            titulo: 'Cambiar Contraseña',
            mensaje: mensaje,
            botones: [
                {
                    text: 'Aceptar',
                    handler: () => {
                        if(exitoso){
                            this.navController.navigateRoot('/tabs-inicio');
                        }
                    }
                }
            ]
        }
        this.alertasService.presentarAlerta(opciones);
    }

}
