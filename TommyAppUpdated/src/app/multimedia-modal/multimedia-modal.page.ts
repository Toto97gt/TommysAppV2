import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-multimedia-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './multimedia-modal.page.html',
  styleUrls: ['./multimedia-modal.page.scss'],
})
export class MultimediaModalPage {
  @Input() url!: string;

  sliderOpts = {
    passiveListeners: false,
    zoom: true,
  };

  constructor(private modalCtrl: ModalController) {}

  dismiss(): void {
    this.modalCtrl.dismiss({ dismissed: true });
  }
}