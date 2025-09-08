import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicioTerminosPageRoutingModule } from './servicio-terminos-routing.module';

import { ServicioTerminosPage } from './servicio-terminos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicioTerminosPageRoutingModule
  ],
  declarations: [ServicioTerminosPage]
})
export class ServicioTerminosPageModule {}
