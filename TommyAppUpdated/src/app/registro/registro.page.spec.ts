import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { RegistroPage } from './registro.page';
import { AlertasService } from 'src/services/alertas.service';
import { RestApiService } from 'src/services/restApi.service';
import { FCMService } from 'src/services/fcm.service';

describe('RegistroPage (standalone)', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  // Spies básicos para servicios inyectados
  const navSpy = jasmine.createSpyObj<NavController>('NavController', ['navigateBack']);
  const alertasSpy = jasmine.createSpyObj<AlertasService>('AlertasService', ['presentLoading', 'dismissLoading', 'presentarAlerta']);
  const restSpy = jasmine.createSpyObj<RestApiService>('RestApiService', ['registrar', 'confirmar', 'autenticar', 'verificarEstadoUsuario']);
  const fcmSpy = jasmine.createSpyObj<FCMService>('FCMService', ['obtenerToken']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        RegistroPage,          // ⬅️ standalone component aquí
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
