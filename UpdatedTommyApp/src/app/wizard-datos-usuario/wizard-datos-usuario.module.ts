import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { WizardDatosUsuarioPageRoutingModule } from './wizard-datos-usuario-routing.module';
import { WizardDatosUsuarioPage } from './wizard-datos-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    IonicSelectableComponent,
    WizardDatosUsuarioPageRoutingModule
  ],
  declarations: [WizardDatosUsuarioPage]
})
export class WizardDatosUsuarioPageModule {}
