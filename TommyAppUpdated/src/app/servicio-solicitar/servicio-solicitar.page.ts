import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';

import { AlertasService } from 'src/services/alertas.service';
import { GpsService } from 'src/services/gps.service';
import { MascotaService } from 'src/services/mascota.service';
import { MultimediaService } from 'src/services/multimedia.service';
import { NetworkService } from 'src/services/network.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-servicio-solicitar',
  templateUrl: './servicio-solicitar.page.html',
  styleUrls: ['./servicio-solicitar.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
})
export class ServicioSolicitarPage implements OnInit {

  servicioForm!: FormGroup;
  tipoProducto = 'ASEO';
  tipoProductoEtiqueta = 'Grooming SPA';
  latitud: number | null = null;
  longitud: number | null = null;
  esDomicilio = false;
  mascotas: any[] = [];
  idMascotas: number[] = [];
  horario: { tienda: { id: number | null; nombre: string }, fecha: string, hora: string, disponible: number } =
    { tienda: { id: null, nombre: '' }, fecha: '', hora: '', disponible: 0 };
  disponible: number | null = null;
  loading: any;

  constructor(
    private form: FormBuilder,
    private navController: NavController,
    private alertasService: AlertasService,
    private storageService: StorageService,
    private restApiService: RestApiService,
    private multimediaService: MultimediaService,
    private networkService: NetworkService,
    private mascotaService: MascotaService,
    private gpsService: GpsService
  ) { }

  async ngOnInit() {
    this.servicioForm = this.form.group({
      'aceptaTerminos': [false, ServicioSolicitarPage.mustBeTruthy],
      'esDomicilio': [false],
      'ubicacion': [false],
      'esGrooming': [true],
      'esBanio': [false],
      'observaciones': ['']
    });

    // Tipo de producto y etiqueta
    const tipoProducto = await this.storageService.getItem('tipoProducto');
    if (tipoProducto) {
      this.tipoProducto = tipoProducto;
      if (tipoProducto === 'PASEO') this.tipoProductoEtiqueta = 'Dog Walker';
    }

    // Horario seleccionado
    const horario: any = await this.storageService.getItemObject('horarioSeleccionado');
    if (horario) {
      this.horario = horario;
      this.disponible = horario.disponible ?? 0;
    } else {
      this.disponible = 0;
    }

    // Cargar mascotas desde cache o API
    const cacheMascotasRaw = await this.storageService.getItemObject('mascotas');

    if (Array.isArray(cacheMascotasRaw) && cacheMascotasRaw.length > 0) {
      this.filtrarMascotas(cacheMascotasRaw);
    } else {
      const mascotasListaRaw = await this.mascotaService.obtenerMascotas();
      const mascotasLista = Array.isArray(mascotasListaRaw) ? mascotasListaRaw : [];
      this.filtrarMascotas(mascotasLista);
    }
  }

  servicioDomicilio(event: any) {
    this.esDomicilio = !!event?.detail?.checked;

    if (!this.esDomicilio) {
      this.servicioForm.get('ubicacion')?.setValue(false);
      this.latitud = null;
      this.longitud = null;
    }
  }

  seleccionarGrooming(event: any) {
    this.servicioForm.get('esBanio')?.setValue(!event?.detail?.checked);
  }

  seleccionarBanio(event: any) {
    this.servicioForm.get('esGrooming')?.setValue(!event?.detail?.checked);
  }

  async obtenerCoordenadas(event: any) {
    const checked = !!event?.detail?.checked;

    if (checked) {
      this.alertasService.presentLoading2('', 10);
      try {
        const posicion: any = await this.gpsService.obtenerPosicion();
        this.latitud = posicion?.latitude ?? null;
        this.longitud = posicion?.longitude ?? null;
      } catch (error: any) {
        console.log('GEO ERROR', error);
        // Si no es "permission denied" (code === 1), reintenta una vez
        if (error?.code !== 1) {
          try {
            const p2: any = await this.gpsService.obtenerPosicion();
            this.latitud = p2?.latitude ?? null;
            this.longitud = p2?.longitude ?? null;
          } catch { /* swallow */ }
        }
      } finally {
        this.alertasService.dismissLoading();
      }
    } else {
      this.latitud = null;
      this.longitud = null;
      this.alertasService.dismissLoading();
    }
  }

  filtrarMascotas(mascotas: any[]) {
    this.mascotas = [];
    mascotas.forEach(mascota => {
      mascota.seleccionada = false;

      if (mascota.urlFoto) {
        this.multimediaService.existeArchivo(mascota.urlFoto).then((resultado: any) => {
          if (resultado.existe) {
            mascota.urlFoto = resultado.url;
            mascota.urlFotoSafe = resultado.urlSafe;
          } else {
            // descarga en background y muestra la remota mientras tanto
            this.multimediaService.descargar(mascota.urlFoto);
            mascota.urlFotoSafe = mascota.urlFoto;
          }

          this.mascotas.push(mascota);
          if (mascotas.length === 1) {
            this.mascotas[0].seleccionada = false;
            this.seleccionarMascota(this.mascotas[0]);
          }
        });
      } else {
        this.mascotas.push(mascota);
        if (mascotas.length === 1) {
          this.mascotas[0].seleccionada = false;
          this.seleccionarMascota(this.mascotas[0]);
        }
      }
    });
  }

  seleccionarMascota(mascota: any) {
    console.log('Mascota seleccionada', mascota);

    const disponibleActual = this.disponible ?? 0;
    if (disponibleActual > 0 || mascota.seleccionada) {
      mascota.seleccionada = !mascota.seleccionada;

      this.idMascotas = this.mascotas
        .filter(m => m.seleccionada)
        .map(m => m.id);

      const cupoBase = this.horario?.disponible ?? 0;
      this.disponible = cupoBase - this.idMascotas.length;
    }
  }

  leerTerminos() {
    this.navController.navigateForward('/servicio-terminos');
  }

  solicitar() {
    this.alertasService.presentLoading('');

    const esBanio = !!this.servicioForm.get('esBanio')?.value;
    const datos = {
      idMascotas: this.idMascotas,
      idTienda: this.horario?.tienda?.id,
      fecha: this.horario?.fecha,
      hora: this.horario?.hora,
      tipoProducto: esBanio ? 'BANIO' : this.tipoProducto,
      latitud: this.latitud,
      longitud: this.longitud,
      esBanio: esBanio,
      esDomicilio: !!this.servicioForm.get('esDomicilio')?.value,
      ubicacion: !!this.servicioForm.get('ubicacion')?.value,
      observaciones: this.servicioForm.get('observaciones')?.value ?? null,
    };

    console.log('Solicitar servicio', datos);

    let tipoTitulo = 'Grooming SPA';
    if (datos.tipoProducto === 'BANIO') {
      tipoTitulo = 'Baño';
    } else if (datos.tipoProducto === 'PASEO') {
      tipoTitulo = 'Dog Walker';
    }

    this.restApiService.postApi('servicio/agregar', datos).then((respuesta: any) => {
      if (respuesta?.exitoso) {
        this.alertaSolicitar(respuesta.mensaje, true, tipoTitulo);
      } else {
        this.alertaSolicitar(respuesta?.mensaje ?? 'No se pudo solicitar el servicio.', false, tipoTitulo);
      }
      this.alertasService.dismissLoading();
    }).catch(() => {
      this.alertasService.dismissLoading();
    });
  }

  alertaSolicitar(mensaje: string, exitoso: boolean, tipoTitulo: string) {
    const opciones = {
      idAlert: 'GUARDAR_FINALIZAR',
      titulo: 'Solicitud de ' + tipoTitulo,
      mensaje,
      botones: [
        {
          text: 'Aceptar',
          handler: () => {
            if (exitoso) {
              this.navController.navigateBack('/servicio-lista');
            } else {
              this.navController.navigateBack('/servicio-agendar');
            }
          }
        }
      ]
    };
    this.alertasService.presentarAlerta(opciones);
  }

  regresar() {
    this.navController.navigateBack('/tabs-servicio');
  }

  static mustBeTruthy(c: AbstractControl): { [key: string]: boolean } | null {
    return c?.value ? null : { notChecked: true };
  }
}