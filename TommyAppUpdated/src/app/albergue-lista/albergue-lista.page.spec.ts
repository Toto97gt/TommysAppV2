import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { AlbergueListaPage } from './albergue-lista.page';

import { AlertasService } from 'src/services/alertas.service';
import { StorageService } from 'src/services/storage.service';
import { NetworkService } from 'src/services/network.service';
import { RestApiService } from 'src/services/restApi.service';
import { GpsService } from 'src/services/gps.service';

describe('AlbergueListaPage (standalone)', () => {
  let component: AlbergueListaPage;
  let fixture: ComponentFixture<AlbergueListaPage>;

  beforeEach(waitForAsync(() => {
    const navSpy = jasmine.createSpyObj('NavController', ['navigateForward']);
    const alertasSpy = jasmine.createSpyObj('AlertasService', ['presentLoading', 'dismissLoading', 'presentarAlerta']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItemObject', 'setItemObject']);
    storageSpy.getItemObject.and.returnValue(Promise.resolve([]));

    const networkSpy = jasmine.createSpyObj('NetworkService', ['getCurrentNetworkStatus']);
    networkSpy.getCurrentNetworkStatus.and.returnValue(1 as any); // simula "Online"

    const restApiSpy = jasmine.createSpyObj('RestApiService', ['postApiPublic']);
    restApiSpy.postApiPublic.and.returnValue(Promise.resolve({ exitoso: true, datos: { albergues: [] } }));

    const gpsSpy = jasmine.createSpyObj('GpsService', ['comoLlegar']);

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), AlbergueListaPage], // ⬅️ standalone: se importa el componente
      providers: [
        { provide: NavController, useValue: navSpy },
        { provide: AlertasService, useValue: alertasSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: NetworkService, useValue: networkSpy },
        { provide: RestApiService, useValue: restApiSpy },
        { provide: GpsService, useValue: gpsSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbergueListaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
