import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlbergueListaPageRoutingModule } from './albergue-lista-routing.module';
import { AlbergueListaPage } from './albergue-lista.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AlbergueListaPageRoutingModule
    ],
    declarations: [AlbergueListaPage]
})
export class AlbergueListaPageModule { }
