import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { WizardDatosMascotaPage } from './wizard-datos-mascota.page';

// Mocks mínimos
const navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateBack', 'navigateForward', 'navigateRoot']);
const alertasSpy = jasmine.createSpyObj('AlertasService', ['presentLoading', 'dismissLoading', 'presentarAlerta']);
const restApiSpy = jasmine.createSpyObj('RestApiService', ['postApi', 'actualizarDatosUsuario']);
const multimediaSpy = jasmine.createSpyObj('MultimediaService', ['capturarFotoUrl', 'galeriaFotoBlob', 'existeArchivo', 'descargar']);

// Storage mock con promesas resueltas
const storageMock = {
  getItem: (_: string) => Promise.resolve(null),
  getItemObject: (_: string) => Promise.resolve(null),
  setItem: (_: string, __: any) => Promise.resolve(true),
  setItemObject: (_: string, __: any) => Promise.resolve(true),
  removeItem: (_: string) => Promise.resolve(true),
};

describe('WizardDatosMascotaPage (standalone)', () => {
  let component: WizardDatosMascotaPage;
  let fixture: ComponentFixture<WizardDatosMascotaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      // ✅ Standalone: se importa el componente, no se declara
      imports: [IonicModule.forRoot(), WizardDatosMascotaPage],
      providers: [
        { provide: NavController, useValue: navCtrlSpy },
        { provide: 'AlertasService', useValue: alertasSpy },
        { provide: 'RestApiService', useValue: restApiSpy },
        { provide: 'MultimediaService', useValue: multimediaSpy },
        { provide: 'StorageService', useValue: storageMock },
      ],
      // Opcional: por si llegara a colarse algún web component no registrado
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WizardDatosMascotaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});