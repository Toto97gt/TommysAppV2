import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MultimediaModalPageRoutingModule } from './multimedia-modal-routing.module';
import { MultimediaModalPage } from './multimedia-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MultimediaModalPageRoutingModule
  ],
  declarations: [MultimediaModalPage]
})
export class DetalleVisitaPageModule {}
