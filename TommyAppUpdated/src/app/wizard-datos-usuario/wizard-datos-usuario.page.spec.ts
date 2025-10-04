import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableComponent } from 'ionic-selectable';

import { WizardDatosUsuarioPage } from './wizard-datos-usuario.page';

// Stubs simples para los servicios inyectados
const navSpy = jasmine.createSpyObj('NavController', ['navigateBack', 'navigateForward']);
const alertasSpy = jasmine.createSpyObj('AlertasService', ['presentLoading', 'dismissLoading', 'presentarAlerta']);
const storageSpy = {
  removeItem: jasmine.createSpy('removeItem').and.returnValue(Promise.resolve()),
  getItemObject: jasmine.createSpy('getItemObject').and.callFake((key: string) => {
    // Devuelve listas vacías por defecto para que el ngOnInit no falle
    if (key === 'departamentos' || key === 'tiendas') return Promise.resolve([]);
    return Promise.resolve(null);
  }),
  getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve(null)),
  setItem: jasmine.createSpy('setItem').and.returnValue(Promise.resolve(true)),
  setItemObject: jasmine.createSpy('setItemObject').and.returnValue(Promise.resolve(true)),
};
const apiSpy = jasmine.createSpyObj('RestApiService', ['postApi']);

describe('WizardDatosUsuarioPage', () => {
  let component: WizardDatosUsuarioPage;
  let fixture: ComponentFixture<WizardDatosUsuarioPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WizardDatosUsuarioPage],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,      // necesario por FormBuilder/FormGroup tipados
        IonicSelectableComponent,    // necesario por <ionic-selectable> en el template
      ],
      providers: [
        { provide: NavController, useValue: navSpy },
        { provide: 'AlertasService', useValue: alertasSpy },
        { provide: 'StorageService', useValue: storageSpy },
        { provide: 'RestApiService', useValue: apiSpy },
      ],
      // Alternativa: si no quieres importar módulos de UI, usa schemas para ignorar tags desconocidos:
      // schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WizardDatosUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara ngOnInit
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
