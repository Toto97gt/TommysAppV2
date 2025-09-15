import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ServicioListaPageRoutingModule } from './servicio-lista-routing.module';
import { ServicioListaPage } from './servicio-lista.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ServicioListaPageRoutingModule
    ],
    declarations: [ServicioListaPage]
})
export class ServicioListaPageModule { }
