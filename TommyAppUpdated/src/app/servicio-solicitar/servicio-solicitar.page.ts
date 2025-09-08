import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
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
})
export class ServicioSolicitarPage implements OnInit {

    servicioForm: FormGroup;
    tipoProducto = 'ASEO';
    tipoProductoEtiqueta = 'Grooming SPA';
    latitud = null;
    longitud = null;
    esDomicilio = false;
    mascotas = [];
    idMascotas = [];
    horario = { tienda: { id: null, nombre: '' }, fecha: '', hora: '', disponible: 0 };
    disponible;
    loading;

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

    ngOnInit() {
        this.servicioForm = this.form.group({
            'aceptaTerminos': [false, ServicioSolicitarPage.mustBeTruthy],
            'esDomicilio': [false],
            'ubicacion': [false],
            'esGrooming': [true],
            'esBanio': [false],
            'observaciones': ['']
        });

        this.storageService.getItem('tipoProducto').then((tipoProducto: any) =>{
            this.tipoProducto = tipoProducto;
            if(tipoProducto == 'PASEO'){
                this.tipoProductoEtiqueta = 'Dog Walker'
            }
        });
        
        this.storageService.getItemObject('horarioSeleccionado').then((horario: any) => {
            this.horario = horario;
            this.disponible = horario.disponible;
        });

        this.mascotas = [];
        this.storageService.getItemObject('mascotas').then((mascotas: any) => {
            if (mascotas !== undefined && mascotas !== null && mascotas.length > 0) {
                this.filtrarMascotas(mascotas);
            } else {
                this.mascotaService.obtenerMascotas().then(mascotasLista => {
                    this.filtrarMascotas(mascotasLista);
                });
            }
            
        });
    }

    servicioDomicilio(event) {
        this.esDomicilio = event.detail.checked;

        if (!event.detail.checked) {
            this.servicioForm.get('ubicacion').setValue(false);
            this.latitud = null;
            this.longitud = null;
        }
    }

    seleccionarGrooming(event) {
        this.servicioForm.get('esBanio').setValue(!event.detail.checked);
    }

    seleccionarBanio(event) {
        this.servicioForm.get('esGrooming').setValue(!event.detail.checked);
    }

    obtenerCoordenadas(event) {
        if (event.detail.checked) {
            this.alertasService.presentLoading2('', 10);
            this.gpsService.obtenerPosicion().then((posicion: any) => {
                this.latitud = posicion.latitude;
                this.longitud = posicion.longitude;

                this.alertasService.dismissLoading();
            }).catch((error) => {
                console.log('GEO ERROR', error);
                this.alertasService.dismissLoading();
                if(error.code !== 1){
                    this.obtenerCoordenadas(event);
                }
            });
        } else {
            this.latitud = null;
            this.longitud = null;
            this.alertasService.dismissLoading();
        }
    }

    filtrarMascotas(mascotas) {
        mascotas.forEach(mascota => {
            mascota.seleccionada = false;
            if(mascota.urlFoto !== undefined && mascota.urlFoto  !== null){
                this.multimediaService.existeArchivo(mascota.urlFoto).then((resultado: any) =>{
                    if (resultado.existe) {
                        mascota.urlFoto = resultado.url;
                        mascota.urlFotoSafe = resultado.urlSafe;
                    } else {
                        this.multimediaService.descargar(mascota.urlFoto);
                        mascota.urlFotoSafe = mascota.urlFoto;
                    }
                    this.mascotas.push(mascota);

                    if(mascotas.length == 1){
                        this.mascotas[0].seleccionada = false;
                        this.seleccionarMascota(this.mascotas[0]);
                    }
                });
            }else{
                this.mascotas.push(mascota);

                if(mascotas.length == 1){
                    this.mascotas[0].seleccionada = false;
                    this.seleccionarMascota(this.mascotas[0]);
                }
            }
        });
    }

    seleccionarMascota(mascota){
        console.log('Mascota seleccionada', mascota);

        if(this.disponible > 0 || mascota.seleccionada){
            mascota.seleccionada = !mascota.seleccionada;

            this.idMascotas = [];
            this.mascotas.forEach(mascota => {
                if(mascota.seleccionada){
                    this.idMascotas.push(mascota.id);
                }
            });

            this.disponible = this.horario.disponible - this.idMascotas.length;
        }
    }

    leerTerminos(){
        this.navController.navigateForward('/servicio-terminos');
    }

    solicitar(){
        this.alertasService.presentLoading('');

        let esBanio = this.servicioForm.get('esBanio').value;
        let datos = {
            idMascotas: this.idMascotas,
            idTienda: this.horario.tienda.id,
            fecha: this.horario.fecha,
            hora: this.horario.hora,
            tipoProducto: esBanio ? 'BANIO' : this.tipoProducto,
            latitud: this.latitud,
            longitud:this.longitud,
            esBanio: this.servicioForm.get('esBanio').value,
            esDomicilio: this.servicioForm.get('esDomicilio').value,
            ubicacion: this.servicioForm.get('ubicacion').value,
            observaciones: this.servicioForm.get('observaciones') !== null ? this.servicioForm.get('observaciones').value : null
        }

        console.log('Solicitar servicio', datos);

        let tipoTitulo = 'Grooming SPA'
        if (datos.tipoProducto == 'BANIO') {
            tipoTitulo = 'Baño'
        } else if (datos.tipoProducto == 'PASEO') {
            tipoTitulo = 'Dog Walker'
        }

        this.restApiService.postApi('servicio/agregar', datos).then((respuesta: any) => {
            if (respuesta.exitoso) {
                this.alertaSolicitar(respuesta.mensaje, true, tipoTitulo);
            } else {
                this.alertaSolicitar(respuesta.mensaje, false, tipoTitulo);
            }
            this.alertasService.dismissLoading();
        });
    }

    alertaSolicitar(mensaje, exitoso, tipoTitulo) {
        let opciones = {
            idAlert: 'GUARDAR_FINALIZAR',
            titulo: 'Solicitud de ' + tipoTitulo,
            mensaje: mensaje,
            botones: [
                {
                    text: 'Aceptar',
                    handler: () => {
                        if(exitoso){
                            this.navController.navigateBack('/servicio-lista');
                        }else{
                            this.navController.navigateBack('/servicio-agendar');
                        }
                        
                    }
                }
            ]
        }
        this.alertasService.presentarAlerta(opciones);
    }

    regresar() {
        this.navController.navigateBack('/tabs-servicio')
    }

    static mustBeTruthy(c: AbstractControl): { [key: string]: boolean } {
        let rv: { [key: string]: boolean } = {};
        if (!c.value) {
            rv['notChecked'] = true;
        }
        return rv;
    }
}
