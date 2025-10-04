import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicioSolicitarPage } from './servicio-solicitar.page';

// Servicios a mockear
import { NavController } from '@ionic/angular';
import { AlertasService } from 'src/services/alertas.service';
import { StorageService } from 'src/services/storage.service';
import { RestApiService } from 'src/services/restApi.service';
import { MultimediaService } from 'src/services/multimedia.service';
import { NetworkService } from 'src/services/network.service';
import { MascotaService } from 'src/services/mascota.service';
import { GpsService } from 'src/services/gps.service';

describe('ServicioSolicitarPage (standalone)', () => {
  let component: ServicioSolicitarPage;
  let fixture: ComponentFixture<ServicioSolicitarPage>;

  // Spies / stubs
  let navSpy: jasmine.SpyObj<NavController>;
  let alertasSpy: jasmine.SpyObj<AlertasService>;
  let storageStub: any;
  let restStub: any;
  let multimediaStub: any;
  let networkStub: any;
  let mascotaStub: any;
  let gpsStub: any;

  beforeEach(waitForAsync(() => {
    // Nav
    navSpy = jasmine.createSpyObj('NavController', ['navigateBack', 'navigateForward', 'navigateRoot']);

    // Alertas
    alertasSpy = jasmine.createSpyObj('AlertasService', [
      'presentLoading',
      'presentLoading2',
      'dismissLoading',
      'presentarAlerta',
    ]);

    // Storage
    storageStub = {
      getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve(null)),
      getItemObject: jasmine.createSpy('getItemObject').and.returnValue(Promise.resolve(null)),
      setItem: jasmine.createSpy('setItem').and.returnValue(Promise.resolve(true)),
      setItemObject: jasmine.createSpy('setItemObject').and.returnValue(Promise.resolve(true)),
    };

    // REST
    restStub = {
      postApi: jasmine.createSpy('postApi').and.returnValue(Promise.resolve({ exitoso: false })),
    };

    // Multimedia
    multimediaStub = {
      existeArchivo: jasmine.createSpy('existeArchivo').and.returnValue(Promise.resolve({ existe: false })),
      descargar: jasmine.createSpy('descargar'),
    };

    // Network (no se usa directamente aquí, stub vacío)
    networkStub = {};

    // Mascota
    mascotaStub = {
      obtenerMascotas: jasmine.createSpy('obtenerMascotas').and.returnValue(Promise.resolve([])),
    };

    // GPS
    gpsStub = {
      obtenerPosicion: jasmine.createSpy('obtenerPosicion').and.returnValue(
        Promise.resolve({ latitude: 0, longitude: 0 })
      ),
    };

    TestBed.configureTestingModule({
      imports: [ServicioSolicitarPage], // <-- standalone
      providers: [
        { provide: NavController, useValue: navSpy },
        { provide: AlertasService, useValue: alertasSpy },
        { provide: StorageService, useValue: storageStub },
        { provide: RestApiService, useValue: restStub },
        { provide: MultimediaService, useValue: multimediaStub },
        { provide: NetworkService, useValue: networkStub },
        { provide: MascotaService, useValue: mascotaStub },
        { provide: GpsService, useValue: gpsStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ServicioSolicitarPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
