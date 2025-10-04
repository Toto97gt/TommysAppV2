import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { ServicioListaPage } from './servicio-lista.page';
import { ConnectionStatus } from 'src/services/network.service';

describe('ServicioListaPage (standalone)', () => {
  let component: ServicioListaPage;
  let fixture: ComponentFixture<ServicioListaPage>;

  beforeEach(waitForAsync(() => {
    // Mocks/Dobles de servicios usados por el componente
    const navSpy = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack', 'navigateRoot']);
    const alertasSpy = jasmine.createSpyObj('AlertasService', ['presentLoading', 'dismissLoading', 'presentarAlerta']);
    const restApiSpy = {
      postApi: jasmine.createSpy('postApi').and.returnValue(
        Promise.resolve({ exitoso: true, datos: { registros: [], total: 0 } })
      ),
    };
    const storageSpy = {
      getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve('ASEO')),
      getItemObject: jasmine.createSpy('getItemObject').and.returnValue(Promise.resolve(null)),
      setItemObject: jasmine.createSpy('setItemObject').and.returnValue(Promise.resolve(true)),
      tieneRolCliente: false,
      tieneRolAseo: false,
    };
    const multimediaSpy = {
      existeArchivo: jasmine.createSpy('existeArchivo').and.returnValue(Promise.resolve({ existe: false })),
      descargar: jasmine.createSpy('descargar'),
    };
    const networkSpy = {
      getCurrentNetworkStatus: jasmine
        .createSpy('getCurrentNetworkStatus')
        .and.returnValue(ConnectionStatus.Online),
    };
    const gpsSpy = { comoLlegar: jasmine.createSpy('comoLlegar') };

    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        // ✅ En standalone se importa el componente directamente
        ServicioListaPage,
      ],
      providers: [
        { provide: NavController, useValue: navSpy },
        { provide: 'AlertasService', useValue: alertasSpy },
        { provide: 'RestApiService', useValue: restApiSpy },
        { provide: 'StorageService', useValue: storageSpy },
        { provide: 'MultimediaService', useValue: multimediaSpy },
        { provide: 'NetworkService', useValue: networkSpy },
        { provide: 'GpsService', useValue: gpsSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicioListaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
