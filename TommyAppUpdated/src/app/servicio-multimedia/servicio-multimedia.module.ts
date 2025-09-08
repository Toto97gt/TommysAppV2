import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ServicioMultimediaPageRoutingModule } from './servicio-multimedia-routing.module';
import { ServicioMultimediaPage } from './servicio-multimedia.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        ServicioMultimediaPageRoutingModule
    ],
    declarations: [ServicioMultimediaPage]
})
export class ServicioMultimediaPageModule { }
