import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonTabs, IonicModule } from '@ionic/angular';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-tabs-servicio',
  templateUrl: './tabs-servicio.page.html',
  styleUrls: ['./tabs-servicio.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule // 
  ],
})
export class TabsServicioPage implements OnInit {
  @ViewChild('tabs', { static: true }) tabsRef!: IonTabs;

  constructor(public storageService: StorageService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    if (this.storageService.tieneRolAseo) {
      this.tabsRef.select('lista');
    }
  }
}