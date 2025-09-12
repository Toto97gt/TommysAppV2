import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { NavController } from '@ionic/angular';

import { AlertasService } from 'src/services/alertas.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

type SolicitarForm = {
  correo: FormControl<string>;
};

type CambiarForm = {
  password: FormControl<string>;
  passwordConfirm: FormControl<string>;
};

@Component({
  selector: 'app-solicitar-contrasenia',
  templateUrl: './solicitar-contrasenia.page.html',
  styleUrls: ['./solicitar-contrasenia.page.scss'],
})
export class SolicitarContraseniaPage implements OnInit {
  solicitarForm!: FormGroup<SolicitarForm>;
  cambiarForm!: FormGroup<CambiarForm>;

  mostrarSolicitarForm = true;
  loading: any;

  constructor(
    private navController: NavController,
    private form: FormBuilder,
    private alertasService: AlertasService,
    private restApiService: RestApiService,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    // Form de cambio de contraseña
    this.cambiarForm = this.form.group<CambiarForm>(
      {
        password: this.form.control('', {
          validators: [Validators.required, Validators.minLength(6)],
          nonNullable: true,
        }),
        passwordConfirm: this.form.control('', {
          validators: [Validators.required],
          nonNullable: true,
        }),
      },
      { validators: this.matchingPasswords('password', 'passwordConfirm') }
    );

    // Form de solicitud por correo
    this.solicitarForm = this.form.group<SolicitarForm>({
      correo: this.form.control('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
    });

    // Mostrar el formulario adecuado según tu flag en storage
    const flag = await this.storageService.getItem('contrasenia');
    this.mostrarSolicitarForm = flag === 'SOLICITAR';
  }

  /** Validador de coincidencia de contraseñas (a nivel de form) */
  private matchingPasswords(
    passwordKey: keyof CambiarForm,
    passwordConfirmKey: keyof CambiarForm
  ): ValidatorFn {
    return (group: AbstractControl) => {
      const fg = group as FormGroup<CambiarForm>;
      const pass = fg.controls[passwordKey].value;
      const confirm = fg.controls[passwordConfirmKey].value;
      return pass === confirm ? null : { mismatchedPasswords: true };
    };
  }

  async solicitar() {
    this.alertasService.presentLoading('');
    try {
      const formData = {
        correo: this.solicitarForm.controls.correo.value,
      };
      const respuesta: any = await this.restApiService.solicitarContrasenia(formData);
      if (respuesta?.exitoso) {
        this.alertaSolicitar('Se ha enviado una contraseña temporal a tu correo.', true);
      } else {
        this.alertaSolicitar(respuesta?.mensaje ?? 'No se pudo procesar la solicitud.', false);
      }
    } finally {
      this.alertasService.dismissLoading();
    }
  }

  async cambiar() {
    this.alertasService.presentLoading('');
    try {
      const datos = {
        password: this.cambiarForm.controls.password.value,
      };
      const respuesta: any = await this.restApiService.postApi('usuario/cambiarContrasenia', datos);
      if (respuesta?.exitoso) {
        this.alertaCambiar('¡Contraseña cambiada exitosamente!', true);
      } else {
        this.alertaCambiar(respuesta?.mensaje ?? 'No se pudo cambiar la contraseña.', false);
      }
    } finally {
      this.alertasService.dismissLoading();
    }
  }

  cancelar() {
    this.navController.navigateForward('/ingreso');
  }

  private alertaSolicitar(mensaje: string, exitoso: boolean) {
    const opciones = {
      idAlert: 'CONSTRASENIA',
      titulo: 'Solicitar Contraseña',
      mensaje,
      botones: [
        {
          text: 'Aceptar',
          handler: () => {
            if (exitoso) {
              this.navController.navigateBack('/ingreso');
            }
          },
        },
      ],
    };
    this.alertasService.presentarAlerta(opciones);
  }

  private alertaCambiar(mensaje: string, exitoso: boolean) {
    const opciones = {
      idAlert: 'CONSTRASENIA',
      titulo: 'Cambiar Contraseña',
      mensaje,
      botones: [
        {
          text: 'Aceptar',
          handler: () => {
            if (exitoso) {
              this.navController.navigateRoot('/tabs-inicio');
            }
          },
        },
      ],
    };
    this.alertasService.presentarAlerta(opciones);
  }
}