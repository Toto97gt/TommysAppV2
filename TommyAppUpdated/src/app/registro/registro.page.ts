import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { AlertasService } from 'src/services/alertas.service';
import { FCMService } from 'src/services/fcm.service';
import { RestApiService } from 'src/services/restApi.service';

@Component({
    selector: 'app-registro',
    templateUrl: './registro.page.html',
    styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  registroForm!: FormGroup;
  confirmarForm!: FormGroup;
  mostrarRegistroForm = true;

  loading: any;

  constructor(
    private navController: NavController,
    private form: FormBuilder,
    private alertasService: AlertasService,
    private restApiService: RestApiService,
    private fCMService: FCMService,
  ) {}

  ngOnInit() {
    this.registroForm = this.form.group(
      {
        correo: [
          '',
          Validators.compose([
            Validators.maxLength(70),
            Validators.pattern(
              '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'
            ),
            Validators.required,
          ]),
        ],
        password: ['', Validators.required],
        passwordConfirm: ['', Validators.required],
      },
      { validators: this.matchingPasswords('password', 'passwordConfirm') }
    );

    this.confirmarForm = this.form.group({
      codigo: ['', Validators.required],
    });
  }

  matchingPasswords(passwordKey: string, passwordConfirmKey: string) {
    return (group: FormGroup): { [key: string]: any } | null => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[passwordConfirmKey];

      if (password.value !== confirmPassword.value) {
        return { mismatchedPasswords: true };
      }
      return null; // ✅ importante para no marcar error cuando coinciden
    };
  }

  registrar() {
    this.alertasService.presentLoading('');

    const formData = {
      correo: this.registroForm.get('correo')?.value,
      password: this.registroForm.get('password')?.value,
    };

    this.restApiService.registrar(formData).then((respuesta: any) => {
      if (respuesta?.exitoso) {
        this.mostrarRegistroForm = false;
        this.alertaRegistrar('Se ha enviado un código de confirmación a tu correo!', true);
      } else {
        this.alertaRegistrar(respuesta?.mensaje ?? 'No se pudo registrar.', false);
      }

      this.alertasService.dismissLoading();
    });
  }

  confirmar() {
    this.alertasService.presentLoading('');

    const formData = {
      correo: this.registroForm.get('correo')?.value,
      codigo: this.confirmarForm.get('codigo')?.value,
    };

    this.restApiService.confirmar(formData).then((respuesta: any) => {
      if (respuesta?.exitoso) {
        this.alertaConfirmar('Usuario registrado exitosamente!', true);
      } else {
        this.alertaConfirmar(respuesta?.mensaje ?? 'No se pudo confirmar.', false);
      }

      this.alertasService.dismissLoading();
    });
  }

  autenticar() {
    const credencialies = {
      username: this.registroForm.get('correo')?.value,
      password: this.registroForm.get('password')?.value,
    };

    this.alertasService.presentLoading('');
    this.restApiService.autenticar(credencialies).then((respuesta: any) => {
      this.alertasService.dismissLoading();

      if (respuesta?.exitoso) {
        this.fCMService.obtenerToken();
        this.restApiService.verificarEstadoUsuario();
      }
    });
  }

  cancelar() {
    this.navController.navigateBack('/ingreso');
  }

  alertaRegistrar(mensaje: string, _exitoso: boolean) {
    const opciones = {
      idAlert: 'REGISTRO',
      titulo: 'Registro de Usuario',
      mensaje,
      botones: [{ text: 'Aceptar', handler: () => {} }],
    };
    this.alertasService.presentarAlerta(opciones);
  }

  alertaConfirmar(mensaje: string, exitoso: boolean) {
    const opciones = {
      idAlert: 'REGISTRO',
      titulo: 'Registro de Usuario',
      mensaje,
      botones: [
        {
          text: 'Aceptar',
          handler: () => {
            if (exitoso) this.autenticar();
          },
        },
      ],
    };
    this.alertasService.presentarAlerta(opciones);
  }
}
