import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IngresoPageRoutingModule } from './ingreso-routing.module';
import { IngresoPage } from './ingreso.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        IngresoPageRoutingModule
    ],
    declarations: [IngresoPage]
})
export class IngresoPageModule { }
