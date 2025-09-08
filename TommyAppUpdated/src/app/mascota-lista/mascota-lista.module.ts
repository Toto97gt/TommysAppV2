import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MascotaListaPageRoutingModule } from './mascota-lista-routing.module';
import { MascotaListaPage } from './mascota-lista.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MascotaListaPageRoutingModule
    ],
    declarations: [MascotaListaPage]
})
export class MascotaListaPageModule { }
