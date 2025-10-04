import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AlertasService } from 'src/services/alertas.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

type Opcion = { id: number; nombre: string };
type Sexo = { id: boolean; nombre: string };

interface UsuarioMin {
  id: number;
  tienda: Opcion;
  names: string;
  surnames: string;
  esPapa: boolean;
  phone: string;
  address: string;
  zone: string;
  departamento: Opcion;
  municipio: Opcion;
}

type UsuarioForm = {
  tienda: FormControl<Opcion | null>;
  nombres: FormControl<string>;
  apellidos: FormControl<string>;
  esPapa: FormControl<Sexo | null>;
  telefono: FormControl<string>;
  direccion: FormControl<string>;
  zona: FormControl<string>;
  departamento: FormControl<Opcion | null>;
  municipio: FormControl<Opcion | null>;
};

@Component({
  selector: 'app-wizard-datos-usuario',
  standalone: true,
  templateUrl: './wizard-datos-usuario.page.html',
  styleUrls: ['./wizard-datos-usuario.page.scss'],
  imports: [CommonModule, ReactiveFormsModule, IonicModule, IonicSelectableComponent]
})
export class WizardDatosUsuarioPage implements OnInit {

  usuarioForm!: FormGroup<UsuarioForm>;

  usuario: UsuarioMin | null = null;
  tiendas: Opcion[] = [];
  sexos: Sexo[] = [];
  departamentos: Opcion[] = [];
  municipios: Opcion[] = [];

  navegacion: string | null = null;

  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private alertasService: AlertasService,
    private storageService: StorageService,
    private restApiService: RestApiService,
  ) {}

  async ngOnInit() {
    this.usuarioForm = this.fb.group<UsuarioForm>({
      tienda: this.fb.control<Opcion | null>(null, { validators: Validators.required }),
      nombres: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
      apellidos: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
      esPapa: this.fb.control<Sexo | null>(null, { validators: Validators.required }),
      telefono: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
      direccion: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
      zona: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
      departamento: this.fb.control<Opcion | null>(null, { validators: Validators.required }),
      municipio: this.fb.control<Opcion | null>(null, { validators: Validators.required }),
    });

    this.storageService.removeItem('mascota');
    this.storageService.removeItem('datosUsuario');

    this.sexos = [{ id: false, nombre: 'Mama' }, { id: true, nombre: 'Papa' }];

    const [departamentos, tiendas] = await Promise.all([
      this.storageService.getItemObject('departamentos'),
      this.storageService.getItemObject('tiendas'),
    ]);
    this.departamentos = departamentos ?? [];
    this.tiendas = tiendas ?? [];

    this.navegacion = await this.storageService.getItem('usuario-navegacion');

    if (this.navegacion === 'ACTUALIZAR') {
      const usuario: UsuarioMin | null = await this.storageService.getItemObject('usuario');
      this.usuario = usuario;

      if (usuario) {
        const municipiosAll = await this.storageService.getItemObject('municipios');
        this.municipios = municipiosAll ? (municipiosAll['departamento' + usuario.departamento.id] ?? []) : [];

        this.usuarioForm.patchValue({
          tienda: usuario.tienda,
          nombres: usuario.names,
          apellidos: usuario.surnames,
          esPapa: usuario.esPapa ? this.sexos[1] : this.sexos[0],
          telefono: usuario.phone,
          direccion: usuario.address,
          zona: usuario.zone,
          departamento: usuario.departamento,
          municipio: usuario.municipio,
        });
      }
    }
  }

  async guardar() {
    const datosUsuario = {
      nombres: this.usuarioForm.controls.nombres.value,
      apellidos: this.usuarioForm.controls.apellidos.value,
      esPapa: this.usuarioForm.controls.esPapa.value, // usa .id si tu API espera booleano
      telefono: this.usuarioForm.controls.telefono.value,
      direccion: this.usuarioForm.controls.direccion.value,
      zona: this.usuarioForm.controls.zona.value,
      idTerritorio: this.usuarioForm.controls.municipio.value?.id,
      idTienda: this.usuarioForm.controls.tienda.value?.id,
    };

    await this.storageService.setItem('mascota-navegacion', 'COMPLETAR');
    await this.storageService.setItemObject('datosUsuario', datosUsuario);
    this.navController.navigateForward('/wizard-datos-mascota');
  }

  async actualizar() {
    this.alertasService.presentLoading('');

    const datosUsuario = {
      id: this.usuario?.id,
      nombres: this.usuarioForm.controls.nombres.value,
      apellidos: this.usuarioForm.controls.apellidos.value,
      esPapa: this.usuarioForm.controls.esPapa.value, // usa .id si tu API espera booleano
      telefono: this.usuarioForm.controls.telefono.value,
      direccion: this.usuarioForm.controls.direccion.value,
      zona: this.usuarioForm.controls.zona.value,
      idTerritorio: this.usuarioForm.controls.municipio.value?.id,
      idTienda: this.usuarioForm.controls.tienda.value?.id,
    };

    try {
      const respuesta: any = await this.restApiService.postApi('usuario/actualizar', datosUsuario);
      if (respuesta?.exitoso) {
        await this.storageService.setItemObject('usuario', respuesta.datos.usuario);
        this.alertaAlmacenar(respuesta.mensaje, true);
      } else {
        this.alertaAlmacenar(respuesta?.mensaje ?? 'Error al actualizar', false);
      }
    } finally {
      this.alertasService.dismissLoading();
    }
  }

  async departamentoChange(event: { component: IonicSelectableComponent; value: Opcion }) {
    this.usuarioForm.controls.municipio.setValue(null);
    const municipiosAll = await this.storageService.getItemObject('municipios');
    this.municipios = municipiosAll ? (municipiosAll['departamento' + event.value.id] ?? []) : [];
  }

  alertaAlmacenar(mensaje: string, exitoso: boolean) {
    const opciones = {
      idAlert: 'GUARDAR_FINALIZAR',
      titulo: 'Actualizar Usuario',
      mensaje,
      botones: [
        {
          text: 'Aceptar',
          handler: () => {
            if (exitoso) {
              this.navController.navigateBack('/tabs-inicio'); // 👈 corregido
            }
          }
        }
      ]
    };
    this.alertasService.presentarAlerta(opciones);
  }
}