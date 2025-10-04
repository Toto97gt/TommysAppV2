import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';

import { DatetimePicker } from '@capawesome-team/capacitor-datetime-picker';

import { AlertasService } from 'src/services/alertas.service';
import { MascotaService } from 'src/services/mascota.service';
import { ConnectionStatus, NetworkService } from 'src/services/network.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-servicio-agendar',
  templateUrl: './servicio-agendar.page.html',
  styleUrls: ['./servicio-agendar.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  providers: [DatePipe],
})
export class ServicioAgendarPage implements OnInit {
  agendarForm!: FormGroup;

  tipoProducto = 'ASEO';
  tiendas: any[] = [];
  horas: Array<{ hora: string; disponible: number }> = [];

  tienda: any;
  fecha!: string;
  loading: any;

  constructor(
    private form: FormBuilder,
    private navController: NavController,
    private datePipe: DatePipe,
    private alertasService: AlertasService,
    private storageService: StorageService,
    private restApiService: RestApiService,
    private networkService: NetworkService,
    private mascotaService: MascotaService
  ) {}

  ngOnInit() {
    this.agendarForm = this.form.group({
      tienda: [{ value: '', disabled: this.storageService.tieneRolAseo }, Validators.required],
      fecha: ['', Validators.required],
    });

    this.cargarTiendas();
  }

  ionViewWillEnter() {
    this.mascotaService.obtenerMascotas();
  }

  cargarTiendas() {
    this.tiendas = [];
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
      this.alertasService.presentLoading('');
      this.restApiService.postApiPublic('tienda/lista', null).then((respuesta: any) => {
        if (respuesta?.datos?.tiendas) {
          this.tiendas = respuesta.datos.tiendas;
        }
        this.tiendaFavoritaPorDefecto();
        this.alertasService.dismissLoading();
      });
    } else {
      this.storageService.getItemObject('tiendas').then((tiendas: any) => {
        this.tiendas = Array.isArray(tiendas) ? tiendas : [];
        this.tiendaFavoritaPorDefecto();
      });
    }
  }

  tiendaFavoritaPorDefecto() {
    this.storageService.getItemObject('usuario').then((usuario: any) => {
      if (usuario?.tienda) {
        this.agendarForm.get('tienda')?.setValue(usuario.tienda);
      }
    });
  }

  /** ✅ Reemplazo de @ionic-native/date-picker por Capawesome DatetimePicker */
  async mostrarCalendario() {
    try {
      const hoy = new Date();
      const { value } = await DatetimePicker.present({
        mode: 'date',
        value: hoy.toISOString(),
        min: hoy.toISOString(), // minDate = hoy
        // locale: 'es-GT',
      });

      const fechaElegida = new Date(value);
      this.fecha = this.datePipe.transform(fechaElegida, 'dd-MM-yyyy')!;
      this.agendarForm.get('fecha')?.setValue(this.fecha);

      this.cargarHorarios();
    } catch {
      // usuario canceló
    }
  }

  cargarHorarios() {
    this.tienda = this.agendarForm.get('tienda')?.value;
    if (this.tienda && this.fecha) {
      this.alertasService.presentLoading('');

      this.horas = [];
      this.storageService.getItem('tipoProducto').then((tipoProducto: any) => {
        if (tipoProducto) this.tipoProducto = tipoProducto;

        this.restApiService
          .postApiPublic('servicio/horarios', {
            tipoProducto: this.tipoProducto,
            idTienda: this.tienda.id,
            fecha: this.fecha,
          })
          .then((respuesta: any) => {
            if (respuesta?.exitoso && Array.isArray(respuesta.datos?.horarios)) {
              this.horas = respuesta.datos.horarios.map((h: any) => ({
                hora: h.hora,
                disponible: h.disponible,
              }));
            }
            this.alertasService.dismissLoading();
          });
      });
    } else {
      this.alertasService.dismissLoading();
    }
  }

  solicitar(hora: { hora: string; disponible: number }) {
    if (hora?.disponible) {
      this.storageService.setItemObject('horarioSeleccionado', {
        tienda: this.tienda,
        fecha: this.fecha,
        hora: hora.hora,
        disponible: hora.disponible,
      });

      if (this.storageService.autenticado) {
        this.navController.navigateForward('/servicio-solicitar');
      } else {
        this.storageService.setItem('urlForward', '/servicio-solicitar');
        this.storageService.setItem('urlBack', '/tabs-servicio');
        this.navController.navigateForward('/ingreso');
      }
    }
  }

  regresar() {
    this.navController.navigateBack('/tabs-inicio');
  }
}