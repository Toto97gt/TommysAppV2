import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonicModule, ActionSheetController, NavController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';

import { DatetimePicker } from '@capawesome-team/capacitor-datetime-picker';
import { Capacitor } from '@capacitor/core';

import { AlertasService } from 'src/services/alertas.service';
import { MultimediaService } from 'src/services/multimedia.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-wizard-datos-mascota',
  standalone: true,
  templateUrl: './wizard-datos-mascota.page.html',
  styleUrls: ['./wizard-datos-mascota.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    IonicSelectableComponent
  ],
  providers: [DatePipe]
})
export class WizardDatosMascotaPage implements OnInit {

  mascotaForm!: FormGroup;
  mascota: any;
  idMascota: number | null = null;

  sexos: any[] = [];
  tipoMascotas: any[] = [];
  razas: any[] = [];
  mostrarOtraRaza = false;

  enfermedades: any[] = [];
  mostrarOtraEnfermedad = false;

  foto: any = null;
  urlFoto: SafeResourceUrl | null = null;

  navegacion: string | null = null;
  loading: any;

  constructor(
    private form: FormBuilder,
    private datePipe: DatePipe,
    private navController: NavController,
    private actionSheetController: ActionSheetController,
    private sanitizer: DomSanitizer,
    private alertasService: AlertasService,
    private storageService: StorageService,
    private restApiService: RestApiService,
    private multimediaService: MultimediaService
  ) {}

  ngOnInit() {
    this.mascotaForm = this.form.group({
      nombre: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      esMacho: ['', Validators.required],
      tipoMascota: ['', Validators.required],
      raza: ['', Validators.required],
      otraRaza: [''],
      enfermedades: [''],
      otraEnfermedad: ['']
    });

    this.sexos = [{ id: false, nombre: 'Hembra' }, { id: true, nombre: 'Macho' }];

    this.storageService.getItemObject('tipoMascotas').then((tipoMascotas: any) => {
      this.tipoMascotas = tipoMascotas;
    });
    this.storageService.getItemObject('enfermedades').then((enfermedades: any) => {
      this.enfermedades = enfermedades;
    });
    this.storageService.getItem('mascota-navegacion').then((n: any) => {
      this.navegacion = n;
    });

    this.storageService.getItemObject('mascota').then((mascota: any) => {
      if (mascota !== null) {
        this.mascota = mascota;
        this.idMascota = mascota.id ?? null;

        if (mascota.urlFoto) {
          this.urlFoto = this.sanitizer.bypassSecurityTrustResourceUrl(mascota.urlFoto);
        }

        this.mascotaForm.get('nombre')!.setValue(mascota.nombre);
        this.mascotaForm.get('fechaNacimiento')!.setValue(mascota.fechaNacimientoFormateada);
        this.mascotaForm.get('esMacho')!.setValue(mascota.esMacho ? this.sexos[1] : this.sexos[0]);
        this.mascotaForm.get('tipoMascota')!.setValue(mascota.tipoMascota);
        this.mascotaForm.get('raza')!.setValue(mascota.raza);
        this.mascotaForm.get('enfermedades')!.setValue(mascota.enfermedades);
        if (mascota.otraRaza != null) this.mascotaForm.get('otraRaza')!.setValue(mascota.otraRaza);
        if (mascota.otraEnfermedad != null) this.mascotaForm.get('otraEnfermedad')!.setValue(mascota.otraEnfermedad);

        this.storageService.getItemObject('razas').then((razas: any) => {
          this.razas = razas[mascota.tipoMascota.id];
        });
      }
    });
  }

  guardar() {
    this.alertasService.presentLoading('');

    const datosMascota = {
      id: this.idMascota,
      nombre: this.mascotaForm.get('nombre')!.value,
      fechaNacimiento: this.mascotaForm.get('fechaNacimiento')!.value,
      esMacho: this.mascotaForm.get('esMacho')!.value,
      tipoMascota: this.mascotaForm.get('tipoMascota')!.value,
      raza: this.mascotaForm.get('raza')!.value,
      otraRaza: this.mascotaForm.get('otraRaza')?.value ?? null,
      enfermedades: this.mascotaForm.get('enfermedades')!.value !== '' ? this.mascotaForm.get('enfermedades')!.value : null,
      otraEnfermedad: this.mascotaForm.get('otraEnfermedad')?.value ?? null,
      foto: this.foto
    };

    if (this.navegacion === 'COMPLETAR') {
      this.storageService.getItemObject('datosUsuario').then(datosUsuario => {
        this.restApiService.postApi('usuario/completarDatos', { datosUsuario, datosMascota }).then((respuesta: any) => {
          if (respuesta.exitoso) {
            this.restApiService.actualizarDatosUsuario().then(() => this.alertaAlmacenar(respuesta.mensaje, true));
          } else {
            this.alertaAlmacenar(respuesta.mensaje, false);
          }
          this.alertasService.dismissLoading();
        });
      }).catch(() => this.alertasService.dismissLoading());
    } else if (this.navegacion === 'AGREGAR') {
      this.restApiService.postApi('mascota/agregar', datosMascota).then((respuesta: any) => {
        this.alertaAlmacenar(respuesta.mensaje, !!respuesta.exitoso);
        this.alertasService.dismissLoading();
      });
    } else if (this.navegacion === 'ACTUALIZAR') {
      this.restApiService.postApi('mascota/actualizar', datosMascota).then((respuesta: any) => {
        this.alertaAlmacenar(respuesta.mensaje, !!respuesta.exitoso);
        this.alertasService.dismissLoading();
      });
    }
  }

  regresar() {
    this.navController.navigateBack('/wizard-datos-usuario');
  }

  razaChange(event: { component: IonicSelectableComponent; value: any }) {
    this.mostrarOtraRaza = event.value?.nombre === 'Otra';
  }

  enfermedadChange(event: { component: IonicSelectableComponent; value: any[] }) {
    this.mostrarOtraEnfermedad = !!event.value?.some(e => e?.nombre === 'Otra');
  }

  tipoMascotaChange(event: { component: IonicSelectableComponent; value: any }) {
    this.storageService.getItemObject('razas').then((razas: any) => {
      this.razas = razas[event.value.id];
    });
  }

  async mostrarCalendario() {
    try {
      const now = new Date();
      const current = this.mascotaForm.get('fechaNacimiento')!.value;
      const initialDate = current ? this.parseFechaDDMMYYYY(current) ?? now : now;

      const { value } = await DatetimePicker.present({
        mode: 'date',
        value: initialDate.toISOString(),
        max: now.toISOString(),
      });

      const elegido = new Date(value);
      const fechaTexto = this.datePipe.transform(elegido, 'dd-MM-yyyy');
      this.mascotaForm.get('fechaNacimiento')!.setValue(fechaTexto);
    } catch {
      // cancelado
    }
  }

  capturarFoto() {
    this.presentActionSheet();
  }

  alertaAlmacenar(mensaje: string, exitoso: boolean) {
    const opciones = {
      idAlert: 'GUARDAR_FINALIZAR',
      titulo: '',
      mensaje,
      botones: [
        {
          text: 'Aceptar',
          handler: () => {
            if (exitoso) {
              if (this.navegacion === 'COMPLETAR') {
                this.storageService.getItem('urlForward').then((url: string) => {
                  if (url && url !== '/tabs-inicio') {
                    this.navController.navigateForward(url);
                  } else {
                    this.navController.navigateRoot('/tabs-inicio');
                  }
                });
              } else {
                this.navController.navigateBack('/mascota-lista');
              }
            }
          }
        }
      ]
    };
    this.alertasService.presentarAlerta(opciones);
  }

  private async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Camara',
          icon: 'camera',
          cssClass: 'customCenter',
          handler: () => {
            this.multimediaService.capturarFotoUrl().then((foto: any) => {
              if (foto) {
                const url = (foto.displayUrl
                  ? foto.displayUrl
                  : this.sanitizer.bypassSecurityTrustResourceUrl(
                      Capacitor.convertFileSrc(foto.url)
                    )) as SafeResourceUrl;
                this.urlFoto = url;
                this.foto = foto;
              }
            });
          }
        },
        {
          text: 'Galeria',
          icon: 'image-outline',
          cssClass: 'customCenter',
          handler: () => {
            this.multimediaService.galeriaFotoBlob().then((foto: any) => {
              if (foto) {
                const url = (foto.displayUrl
                  ? foto.displayUrl
                  : this.sanitizer.bypassSecurityTrustResourceUrl(
                      Capacitor.convertFileSrc(foto.url)
                    )) as SafeResourceUrl;
                this.urlFoto = url;
                this.foto = foto;
              }
            });
          }
        }
      ]
    });

    await actionSheet.present();
  }

  private parseFechaDDMMYYYY(txt: string): Date | null {
    const [dd, mm, yyyy] = (txt || '').split('-').map(Number);
    if (!dd || !mm || !yyyy) return null;
    const d = new Date(yyyy, mm - 1, dd);
    return isNaN(d.getTime()) ? null : d;
  }
}