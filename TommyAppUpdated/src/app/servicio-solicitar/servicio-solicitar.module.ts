import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ServicioSolicitarPageRoutingModule } from './servicio-solicitar-routing.module';
import { ServicioSolicitarPage } from './servicio-solicitar.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        ServicioSolicitarPageRoutingModule
    ],
    declarations: [ServicioSolicitarPage]
})
export class ServicioSolicitarPageModule { }
