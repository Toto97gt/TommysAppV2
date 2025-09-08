import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SolicitarContraseniaPageRoutingModule } from './solicitar-contrasenia-routing.module';
import { SolicitarContraseniaPage } from './solicitar-contrasenia.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        SolicitarContraseniaPageRoutingModule
    ],
    declarations: [SolicitarContraseniaPage]
})
export class SolicitarContraseniaPageModule { }
