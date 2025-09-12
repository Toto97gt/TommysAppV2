import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AlertasService } from 'src/services/alertas.service';
import { FCMService } from 'src/services/fcm.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
})
export class IngresoPage implements OnInit {
  ingresoForm!: FormGroup;

  constructor(
    private navController: NavController,
    private form: FormBuilder,
    private alertasService: AlertasService,
    private restApiService: RestApiService,
    private fCMService: FCMService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.ingresoForm = this.form.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  autenticar(): void {
    const credencialies = {
      username: this.ingresoForm.get('username')?.value ?? '',
      password: this.ingresoForm.get('password')?.value ?? '',
    };

    this.alertasService.presentLoading('');

    this.restApiService.autenticar(credencialies).then((respuesta: any) => {
      this.alertasService.dismissLoading();

      if (respuesta?.exitoso) {
        this.ingresoForm.get('username')?.setValue('');
        this.ingresoForm.get('password')?.setValue('');

        this.fCMService.obtenerToken();

        this.storageService.getItem('urlForward').then((url: string) => {
          if (url && url !== '/tabs-inicio') {
            this.navController.navigateForward(url);
          } else {
            this.navController.navigateRoot('/tabs-inicio');
          }
        });
      } else if (respuesta?.status === 400 || respuesta?.status === 401) {
        this.alertaIngreso('Usuario o contraseña incorrectos.', true);
      } else {
        this.alertaIngreso('Por favor intente en unos minutos.', false);
      }
    });
  }

  cancelar(): void {
    this.storageService.getItem('urlBack').then((url: string) => {
      if (url && url !== '/tabs-inicio') {
        this.navController.navigateBack(url);
      } else {
        this.navController.navigateRoot('/tabs-inicio');
      }
    });
  }

  registro(): void {
    this.navController.navigateForward('/registro');
  }

  cambiarContrasenia(): void {
    this.storageService.setItem('contrasenia', 'SOLICITAR');
    this.navController.navigateForward('/solicitar-contrasenia');
  }

  alertaIngreso(mensaje: string, _exitoso: boolean): void {
    const opciones = {
      idAlert: 'INGRESO',
      titulo: 'Ingreso',
      mensaje,
      botones: [
        {
          text: 'Corregir',
          handler: () => {},
        },
      ],
    };
    this.alertasService.presentarAlerta(opciones);
  }
}