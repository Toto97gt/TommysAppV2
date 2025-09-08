import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-multimedia-modal',
    templateUrl: './multimedia-modal.page.html',
    styleUrls: ['./multimedia-modal.page.scss'],
})
export class MultimediaModalPage implements OnInit {

    @Input('url') url: any;

    sliderOpts = {
        passiveListeners: false,
        zoom: true
    };

    constructor(private modalCtrl: ModalController) { }

    ngOnInit() { }

    dismiss() {
        this.modalCtrl.dismiss({
            dismissed: true
        });
    }
}