import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlbergueMascotasPageRoutingModule } from './albergue-mascotas-routing.module';
import { AlbergueMascotasPage } from './albergue-mascotas.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AlbergueMascotasPageRoutingModule
    ],
    declarations: [AlbergueMascotasPage]
})
export class AlbergueMascotasPageModule { }
