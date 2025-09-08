import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TiendaListaPageRoutingModule } from './tienda-lista-routing.module';
import { TiendaListaPage } from './tienda-lista.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TiendaListaPageRoutingModule
    ],
    declarations: [TiendaListaPage]
})
export class TiendaListaPageModule { }
