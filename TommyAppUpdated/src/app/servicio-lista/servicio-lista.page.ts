import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';

import { DatetimePicker } from '@capawesome-team/capacitor-datetime-picker';
import { AppLauncher } from '@capacitor/app-launcher';
import { Capacitor } from '@capacitor/core';

import { AlertasService } from 'src/services/alertas.service';
import { GpsService } from 'src/services/gps.service';
import { MultimediaService } from 'src/services/multimedia.service';
import { ConnectionStatus, NetworkService } from 'src/services/network.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-servicio-lista',
  templateUrl: './servicio-lista.page.html',
  styleUrls: ['./servicio-lista.page.scss'],
})
export class ServicioListaPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  tipoProducto = 'ASEO';
  tipoProductoEtiqueta = 'Grooming SPA';
  servicios: any[] = [];
  segmento: 'agendados' | 'historial' | string = 'agendados';
  loading: any;
  fecha!: string;
  pagina = 0;
  mostrarMas = false;

  constructor(
    private navController: NavController,
    private datePipe: DatePipe,
    private alertasService: AlertasService,
    private restApiService: RestApiService,
    public storageService: StorageService,
    private multimediaService: MultimediaService,
    private networkService: NetworkService,
    private gpsService: GpsService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fecha = this.datePipe.transform(new Date(), 'dd-MM-yyyy')!;
    this.storageService.getItem('tipoProducto').then((tipoProducto: any) => {
      if (tipoProducto) {
        this.tipoProducto = tipoProducto;
        if (tipoProducto === 'PASEO') this.tipoProductoEtiqueta = 'Dog Walker';
      }
      this.iniciarDatos();
    });
  }

  segmentChanged(event: any) {
    this.segmento = event.detail.value;
    this.iniciarDatos();
  }

  iniciarDatos() {
    this.pagina = 0;
    this.mostrarMas = false;

    if (this.segmento === 'agendados') {
      this.cargarServicios();
    } else {
      this.cargarHistorial();
    }
  }

  cargarServicios() {
    if (this.pagina === 0) this.servicios = [];

    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
      this.alertasService.presentLoading('');
      this.restApiService
        .postApi('servicio/lista', { tipoProducto: this.tipoProducto, fecha: this.fecha, pagina: this.pagina })
        .then((respuesta: any) => {
          if (respuesta?.exitoso) {
            this.revisarArchivosLocales(
              respuesta.datos.registros,
              respuesta.datos.total,
              this.tipoProducto.toLowerCase() + 'Servicios'
            );
          } else {
            console.error('No se han podido cargar los servicios.', respuesta);
          }
          this.alertasService.dismissLoading();
        });
    } else {
      this.storageService.getItemObject(this.tipoProducto.toLowerCase() + 'Servicios').then((servicios: any) => {
        if (servicios !== null) {
          this.servicios = servicios;
          this.revisarArchivosLocalesOffline(this.servicios);
        } else {
          this.servicios = [];
        }
      });
    }
  }

  cargarHistorial() {
    if (this.pagina === 0) this.servicios = [];

    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
      this.alertasService.presentLoading('');
      this.restApiService
        .postApi('servicio/historial', { tipoProducto: this.tipoProducto, pagina: this.pagina })
        .then((respuesta: any) => {
          if (respuesta?.exitoso) {
            this.revisarArchivosLocales(
              respuesta.datos.registros,
              respuesta.datos.total,
              this.tipoProducto.toLowerCase() + 'Historial'
            );
          } else {
            console.error('No se han podido cargar el historial', respuesta);
          }
          this.alertasService.dismissLoading();
        });
    } else {
      this.storageService.getItemObject(this.tipoProducto.toLowerCase() + 'Historial').then((servicios: any) => {
        if (servicios !== null) {
          this.servicios = servicios;
          this.revisarArchivosLocalesOffline(this.servicios);
        } else {
          this.servicios = [];
        }
      });
    }
  }

  cargarMas() {
    this.pagina++;
    if (this.segmento === 'agendados') {
      this.cargarServicios();
    } else {
      this.cargarHistorial();
    }
  }

  revisarArchivosLocales(servicios: any[], total: number, nombre: string) {
    servicios.forEach(servicio => {
      if (servicio?.mascota?.urlFoto) {
        this.multimediaService.existeArchivo(servicio.mascota.urlFoto).then((resultado: any) => {
          if (resultado.existe) {
            servicio.mascota.urlFoto = resultado.url;
            servicio.mascota.urlFotoSafe = resultado.urlSafe;
          } else {
            this.multimediaService.descargar(servicio.mascota.urlFoto);
            servicio.mascota.urlFotoSafe = servicio.mascota.urlFoto;
          }

          this.servicios.push(servicio);
          this.mostrarMas = this.servicios.length < total;
          this.storageService.setItemObject(nombre, this.servicios);
        });
      } else {
        this.servicios.push(servicio);
        this.mostrarMas = this.servicios.length < total;
        this.storageService.setItemObject(nombre, this.servicios);
      }
    });
  }

  revisarArchivosLocalesOffline(servicios: any[]) {
    this.servicios = [];
    servicios.forEach(servicio => {
      if (servicio?.mascota?.urlFoto) {
        this.multimediaService.existeArchivo(servicio.mascota.urlFoto).then((resultado: any) => {
          if (resultado.existe) {
            servicio.mascota.urlFoto = resultado.url;
            servicio.mascota.urlFotoSafe = resultado.urlSafe;
          } else {
            this.multimediaService.descargar(servicio.mascota.urlFoto);
            servicio.mascota.urlFotoSafe = servicio.mascota.urlFoto;
          }
          this.servicios.push(servicio);
        });
      } else {
        this.servicios.push(servicio);
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
        min: hoy.toISOString(), // mismo comportamiento que antes (minDate = hoy)
        // locale: 'es-GT', // opcional
      });

      const fechaElegida = new Date(value);
      this.fecha = this.datePipe.transform(fechaElegida, 'dd-MM-yyyy')!;

      this.pagina = 0;
      this.mostrarMas = false;
      this.cargarServicios();
    } catch {
      // usuario canceló; no hacer nada
    }
  }

  cancelarServicio(servicio: any) {
    this.alertasService.presentLoading('');
    const datos = { idServicio: servicio.id };

    this.restApiService.postApi('servicio/cancelar', datos).then((respuesta: any) => {
      const titulo = 'Cancelar ' + servicio.tipoProductoEtiqueta;
      if (respuesta?.exitoso) {
        this.alertaCancelar(respuesta.mensaje, titulo, true);
      } else {
        this.alertaCancelar(respuesta?.mensaje ?? 'No se pudo cancelar.', titulo, false);
      }
      this.alertasService.dismissLoading();
    });
  }

  cambiarEstadoServicio(servicio: any) {
    this.alertasService.presentLoading('');

    const datos = {
      idServicio: servicio.id,
      estado: servicio.estado === 'SOLICITUD' ? 'EN_PROCESO' : 'FINALIZADO',
    };

    this.restApiService.postApi('servicio/actualizar/estado', datos).then((respuesta: any) => {
      const titulo = 'Iniciar ' + this.tipoProductoEtiqueta;
      if (respuesta?.exitoso) {
        this.alertaCancelar(respuesta.mensaje, titulo, true);
      } else {
        this.alertaCancelar(respuesta?.mensaje ?? 'No se pudo actualizar.', titulo, false);
      }
      this.alertasService.dismissLoading();
    });
  }

  goDetalle(servicio: any) {
    if (this.storageService.tieneRolCliente || this.storageService.tieneRolAseo) {
      this.storageService.setItemObject('servicio', servicio).then(() => {
        this.navController.navigateForward('/servicio-detalle');
      });
    }
  }

  regresar() {
    this.navController.navigateBack('/tabs-inicio');
  }

  confirmarCancelar(servicio: any) {
    const opciones = {
      idAlert: 'GUARDAR_FINALIZAR',
      titulo: 'Cancelar ' + this.tipoProductoEtiqueta,
      mensaje: 'Estas seguro?',
      botones: [
        { text: 'Si', handler: () => this.cancelarServicio(servicio) },
        { text: 'No Cancelar', handler: () => {} },
      ],
    };
    this.alertasService.presentarAlerta(opciones);
  }

  confirmarCambiarEstadoServicio(servicio: any, iniciar: boolean) {
    const opciones = {
      idAlert: 'GUARDAR_FINALIZAR',
      titulo: iniciar ? 'Iniciar ' + servicio.tipoProductoEtiqueta : 'Finalizar ' + servicio.tipoProductoEtiqueta,
      mensaje: 'Estas seguro?',
      botones: [
        { text: 'Cancelar', handler: () => {} },
        { text: 'Aceptar', handler: () => this.cambiarEstadoServicio(servicio) },
      ],
    };
    this.alertasService.presentarAlerta(opciones);
  }

  alertaCancelar(mensaje: string, titulo: string, _exitoso: boolean) {
    const opciones = {
      idAlert: 'GUARDAR_FINALIZAR',
      titulo,
      mensaje,
      botones: [{ text: 'Aceptar', handler: () => this.ionViewWillEnter() }],
    };
    this.alertasService.presentarAlerta(opciones);
  }

  comoLlegar(latitud: number, longitud: number) {
    this.gpsService.comoLlegar(latitud, longitud);
  }

  /** ✅ Reemplazo de CallNumber por AppLauncher tel: */
  async llamar(telefono: string) {
    const url = `tel:${telefono}`;
    try {
      if (Capacitor.getPlatform() === 'web') {
        window.location.href = url;
        return;
      }
      const can = await AppLauncher.canOpenUrl({ url });
      if (can.value) {
        await AppLauncher.openUrl({ url });
      } else {
        window.location.href = url;
      }
    } catch {
      window.location.href = url;
    }
  }
}