import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NotificacionListaPageRoutingModule } from './notificacion-lista-routing.module';
import { NotificacionListaPage } from './notificacion-lista.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NotificacionListaPageRoutingModule
    ],
    declarations: [NotificacionListaPage]
})
export class NotificacionListaPageModule { }
