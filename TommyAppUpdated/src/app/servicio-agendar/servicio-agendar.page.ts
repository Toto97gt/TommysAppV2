import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { NavController } from '@ionic/angular';
import { AlertasService } from 'src/services/alertas.service';
import { MascotaService } from 'src/services/mascota.service';
import { ConnectionStatus, NetworkService } from 'src/services/network.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
    selector: 'app-servicio-agendar',
    templateUrl: './servicio-agendar.page.html',
    styleUrls: ['./servicio-agendar.page.scss'],
})
export class ServicioAgendarPage implements OnInit {

    agendarForm: FormGroup;
    tipoProducto = 'ASEO'
    tiendas = [];
    horas = [];
    tienda;
    fecha;
    loading;

    constructor(
        private form: FormBuilder,
        private navController: NavController,
        private datePicker: DatePicker,
        private datePipe: DatePipe,
        private alertasService: AlertasService,
        private storageService: StorageService,
        private restApiService: RestApiService,
        private networkService: NetworkService,
        private mascotaService: MascotaService
    ) { }

    ngOnInit() {
        this.agendarForm = this.form.group({
            'tienda': [{ value: '', disabled: this.storageService.tieneRolAseo }, Validators.required],
            'fecha': ['', Validators.required]
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
                this.tiendas = respuesta.datos.tiendas;
                
                this.tiendaFavoritaPorDefecto();
                this.alertasService.dismissLoading();
            });
        } else {
            this.storageService.getItemObject('tiendas').then((tiendas: any) => {
                this.tiendas = tiendas;
                this.tiendaFavoritaPorDefecto();
            });
        }
    }

    tiendaFavoritaPorDefecto(){
        this.storageService.getItemObject('usuario').then((usuario: any) => {
            if(usuario !== null){
                this.agendarForm.get('tienda').setValue(usuario.tienda);
            }
        });
    }

    mostrarCalendario() {
        this.datePicker.show({
            minDate: new Date().getTime(),
            date:  new Date(),
            mode: 'date',
            androidTheme: 5
        }).then((date: any) => {
            let fechaElegida = new Date(date);
            this.fecha = this.datePipe.transform(fechaElegida, "dd-MM-yyyy");
            this.agendarForm.get('fecha').setValue(this.fecha);

            this.cargarHorarios();
        });
    }

    cargarHorarios(){
        this.tienda = this.agendarForm.get('tienda').value;
        if (this.tienda !== '' && this.fecha !== undefined) {
            this.alertasService.presentLoading('')
            
            this.horas = [];
            this.storageService.getItem('tipoProducto').then((tipoProducto: any) =>{
                this.tipoProducto = tipoProducto;
                this.restApiService.postApiPublic('servicio/horarios', { tipoProducto: tipoProducto, idTienda: this.tienda.id, fecha: this.fecha }).then((respuesta: any) => {
                    if (respuesta.exitoso) {
                        respuesta.datos.horarios.forEach(hora => {
                            this.horas.push({ hora: hora.hora, disponible: hora.disponible });
                        });
                    }

                    this.alertasService.dismissLoading();
                });
            });
        } else {
            this.alertasService.dismissLoading();
        }
    }

    solicitar(hora){
        if(hora.disponible){
            this.storageService.setItemObject('horarioSeleccionado', { tienda: this.tienda, fecha: this.fecha, hora: hora.hora, disponible: hora.disponible });

            if(this.storageService.autenticado){
                this.navController.navigateForward('/servicio-solicitar');
            }else{
                this.storageService.setItem('urlForward', '/servicio-solicitar');
                this.storageService.setItem('urlBack', '/tabs-servicio');
                this.navController.navigateForward('/ingreso');
            }
        }
    }

    regresar() {
        this.navController.navigateBack('/tabs-inicio')
    }

}
