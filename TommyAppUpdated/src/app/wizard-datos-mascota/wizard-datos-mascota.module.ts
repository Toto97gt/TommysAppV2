import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { WizardDatosMascotaPageRoutingModule } from './wizard-datos-mascota-routing.module';
import { WizardDatosMascotaPage } from './wizard-datos-mascota.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        IonicSelectableComponent,
        WizardDatosMascotaPageRoutingModule
    ],
    declarations: [WizardDatosMascotaPage]
})
export class WizardDatosMascotaPageModule { }
