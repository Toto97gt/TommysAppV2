import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ServicioAgendarPageRoutingModule } from './servicio-agendar-routing.module';
import { ServicioAgendarPage } from './servicio-agendar.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        IonicSelectableComponent,
        ServicioAgendarPageRoutingModule
    ],
    declarations: [ServicioAgendarPage]
})
export class ServicioAgendarPageModule { }
