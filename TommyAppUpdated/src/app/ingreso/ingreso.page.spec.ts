import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { IngresoPage } from './ingreso.page';

import { AlertasService } from 'src/services/alertas.service';
import { RestApiService } from 'src/services/restApi.service';
import { FCMService } from 'src/services/fcm.service';
import { StorageService } from 'src/services/storage.service';

describe('IngresoPage', () => {
  let component: IngresoPage;
  let fixture: ComponentFixture<IngresoPage>;

  let navSpy: jasmine.SpyObj<NavController>;
  let alertasSpy: jasmine.SpyObj<AlertasService>;
  let restSpy: { autenticar: jasmine.Spy };
  let fcmSpy: jasmine.SpyObj<FCMService>;
  let storageSpy: {
    getItem: jasmine.Spy;
    setItem: jasmine.Spy;
  };

  beforeEach(waitForAsync(() => {
    // Spies / stubs
    navSpy = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateRoot', 'navigateBack']);
    alertasSpy = jasmine.createSpyObj('AlertasService', ['presentLoading', 'dismissLoading', 'presentarAlerta']);
    restSpy = {
      autenticar: jasmine.createSpy('autenticar').and.returnValue(Promise.resolve({ exitoso: true })),
    };
    fcmSpy = jasmine.createSpyObj('FCMService', ['obtenerToken']);
    storageSpy = {
      getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve(null)),
      setItem: jasmine.createSpy('setItem').and.returnValue(Promise.resolve()),
    };

    TestBed.configureTestingModule({
      // ✅ Standalone: importa el componente en lugar de declararlo
      imports: [IonicModule.forRoot(), IngresoPage],
      providers: [
        { provide: NavController, useValue: navSpy },
        { provide: AlertasService, useValue: alertasSpy },
        { provide: RestApiService, useValue: restSpy },
        { provide: FCMService, useValue: fcmSpy },
        { provide: StorageService, useValue: storageSpy },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(IngresoPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
