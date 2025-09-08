import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { ActionSheetController, NavController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AlertasService } from 'src/services/alertas.service';
import { MultimediaService } from 'src/services/multimedia.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

@Component({
    selector: 'app-wizard-datos-mascota',
    templateUrl: './wizard-datos-mascota.page.html',
    styleUrls: ['./wizard-datos-mascota.page.scss'],
})
export class WizardDatosMascotaPage implements OnInit {

    mascotaForm: FormGroup;
    mascota: any
    idMascota = null;
    sexos = [];
    tipoMascotas = [];
    razas = [];
    mostrarOtraRaza = false;
    enfermedades = [];
    mostrarOtraEnfermedad = false;
    foto = null;
    urlFoto: Object;
    
    navegacion = null;
    loading;

    constructor(
        private form: FormBuilder,
        private datePicker: DatePicker, 
        private datePipe: DatePipe,
        private navController: NavController,
        private actionSheetController: ActionSheetController,
        private sanitizer: DomSanitizer,
        private alertasService: AlertasService,
        private storageService: StorageService,
        private restApiService: RestApiService,
        private multimediaService: MultimediaService
    ) { }

    ngOnInit() {
        this.mascotaForm = this.form.group({
            'nombre': ['', Validators.required],
            'fechaNacimiento': ['', Validators.required],
            'esMacho': ['', Validators.required],
            'tipoMascota': ['', Validators.required],
            'raza': ['', Validators.required],
            'otraRaza': [''],
            'enfermedades': [''],
            'otraAlergia': ['']
        });

        this.sexos = [{id: false, nombre: 'Hembra'}, {id: true, nombre: 'Macho'}];
        this.storageService.getItemObject('tipoMascotas').then((tipoMascotas: any) =>{
            this.tipoMascotas = tipoMascotas
        });
        this.storageService.getItemObject('enfermedades').then((enfermedades: any) =>{
            this.enfermedades = enfermedades
        });
        this.storageService.getItem('mascota-navegacion').then((navegacion: any) =>{
            this.navegacion = navegacion;
        });

        this.storageService.getItemObject('mascota').then((mascota: any) => {
            if(mascota !== null){
                this.mascota = mascota;
                this.idMascota = mascota.id;

                if (mascota.urlFoto !== undefined && mascota.urlFoto !== null) {
                    this.urlFoto = this.sanitizer.bypassSecurityTrustResourceUrl(mascota.urlFoto);
                }

                this.mascotaForm.get('nombre').setValue(mascota.nombre);
                this.mascotaForm.get('fechaNacimiento').setValue(mascota.fechaNacimientoFormateada);
                this.mascotaForm.get('esMacho').setValue(mascota.esMacho ? this.sexos[1] : this.sexos[0]);
                this.mascotaForm.get('tipoMascota').setValue(mascota.tipoMascota);
                this.mascotaForm.get('raza').setValue(mascota.raza);
                this.mascotaForm.get('enfermedades').setValue(mascota.enfermedades);
                if(mascota.otraRaza !== undefined && mascota.otraRaza !== null){
                    this.mascotaForm.get('otraRaza').setValue(mascota.otraRaza);    
                }
                if(mascota.otraEnfermedad !== undefined && mascota.otraEnfermedad !== null){
                    this.mascotaForm.get('otraEnfermedad').setValue(mascota.otraEnfermedad);    
                }

                this.storageService.getItemObject('razas').then((razas: any) =>{
                    this.razas = razas[mascota.tipoMascota.id];
                });
            }
        });
    }

    guardar() {
        this.alertasService.presentLoading('');

        let datosMascota = {
            id: this.idMascota,
            nombre: this.mascotaForm.get('nombre').value,
            fechaNacimiento: this.mascotaForm.get('fechaNacimiento').value,
            esMacho: this.mascotaForm.get('esMacho').value,
            tipoMascota: this.mascotaForm.get('tipoMascota').value,
            raza: this.mascotaForm.get('raza').value,
            otraRaza: this.mascotaForm.get('otraRaza') !== null ? this.mascotaForm.get('otraRaza').value : null,
            enfermedades: this.mascotaForm.get('enfermedades').value !== '' ? this.mascotaForm.get('enfermedades').value : null,
            otraEnfermedad: this.mascotaForm.get('otraEnfermedad') !== null ? this.mascotaForm.get('otraEnfermedad').value : null,
            foto: this.foto
        };

        if(this.navegacion === 'COMPLETAR'){
            this.storageService.getItemObject('datosUsuario').then(datosUsuario => {
                this.restApiService.postApi('usuario/completarDatos', { datosUsuario: datosUsuario, datosMascota: datosMascota }).then((respuesta: any) => {
                    if (respuesta.exitoso) {
                        this.restApiService.actualizarDatosUsuario().then(resultado => {
                            this.alertaAlmacenar(respuesta.mensaje, true);
                        });
                    } else {
                        this.alertaAlmacenar(respuesta.mensaje, false);
                    }
    
                    this.alertasService.dismissLoading();
                });
            }).catch(error => {
                this.alertasService.dismissLoading();
            });
        }else if(this.navegacion == 'AGREGAR'){
            this.restApiService.postApi('mascota/agregar', datosMascota).then((respuesta: any) => {
                if (respuesta.exitoso) {
                    this.alertaAlmacenar(respuesta.mensaje, true);
                } else {
                    this.alertaAlmacenar(respuesta.mensaje, false);
                }

                this.alertasService.dismissLoading();
            });
        }else if(this.navegacion == 'ACTUALIZAR'){
            this.restApiService.postApi('mascota/actualizar', datosMascota).then((respuesta: any) => {
                if (respuesta.exitoso) {
                    this.alertaAlmacenar(respuesta.mensaje, true);
                } else {
                    this.alertaAlmacenar(respuesta.mensaje, false);
                }

                this.alertasService.dismissLoading();
            });
        }
    }

    regresar() {
        this.navController.navigateBack('/wizard-datos-usuario');
    }

    razaChange(event: { component: IonicSelectableComponent, value: any }) {
        this.mostrarOtraRaza = event.value.nombre === 'Otra';
    }

    enfermedadChange(event: { component: IonicSelectableComponent, value: any }) {
        event.value.forEach(enfermedad => {
            if(enfermedad.nombre === 'Otra'){
                this.mostrarOtraEnfermedad = true;
            }
        });
    }

    tipoMascotaChange(event: { component: IonicSelectableComponent, value: any }) {
        this.storageService.getItemObject('razas').then((razas: any) =>{
            this.razas = razas[event.value.id];
        });
    }

    mostrarCalendario() {
        this.datePicker.show({
            maxDate: new Date().getTime(),
            date:  new Date(),
            mode: 'date',
            androidTheme: 5
        }).then((date: any) => {
            const fechaElegida = new Date(date);
            let fechaTexto = this.datePipe.transform(fechaElegida, "dd-MM-yyyy");
            this.mascotaForm.get('fechaNacimiento').setValue(fechaTexto);
        });
    }

    capturarFoto(){
        this.presentActionSheet();
    }

    alertaAlmacenar(mensaje, exitoso) {
        let opciones = {
            idAlert: 'GUARDAR_FINALIZAR',
            titulo: '',
            mensaje: mensaje,
            botones: [
                {
                    text: 'Aceptar',
                    handler: () => {
                        if(exitoso){
                            if(this.navegacion === 'COMPLETAR'){
                                this.storageService.getItem('urlForward').then((url: string) => {
                                    if (url !== null && url !== '/tabs-inicio') {
                                        this.navController.navigateForward(url);
                                    } else {
                                        this.navController.navigateRoot('/tabs-inicio');
                                    }
                                });
                            }else{
                                this.navController.navigateBack('/mascota-lista');
                            }
                        }                        
                    }
                }
            ]
        }
        this.alertasService.presentarAlerta(opciones);
    }

    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            buttons: [
                {
                    text: 'Camara',
                    icon: 'camera',
                    cssClass: 'customCenter',
                    handler: () => {
                        this.multimediaService.capturarFotoUrl().then((foto: any) =>{
                            if(foto != null){
                                const win: any = window;
                                const url = win.Ionic.WebView.convertFileSrc(foto.url)
                                this.urlFoto = this.sanitizer.bypassSecurityTrustResourceUrl(url);
                                
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
                        this.multimediaService.galeriaFotoBlob().then((foto: any) =>{
                            if(foto != null){
                                const win: any = window;
                                const url = win.Ionic.WebView.convertFileSrc(foto.url)
                                this.urlFoto = this.sanitizer.bypassSecurityTrustResourceUrl(url);;
                                
                                this.foto = foto;
                            }
                        });
                    }
                }
            ]
        });
        
        await actionSheet.present();
    }

}
