import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-servicio-terminos',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './servicio-terminos.page.html',
  styleUrls: ['./servicio-terminos.page.scss'],
})
export class ServicioTerminosPage implements OnInit {
  terminos: any;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.storageService.getItem('terminos').then((terminos: any) => {
      this.terminos = terminos;
    });
  }
}
