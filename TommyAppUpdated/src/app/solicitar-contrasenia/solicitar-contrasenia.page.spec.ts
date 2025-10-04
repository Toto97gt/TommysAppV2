import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { SolicitarContraseniaPage } from './solicitar-contrasenia.page';
import { AlertasService } from 'src/services/alertas.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

describe('SolicitarContraseniaPage (standalone)', () => {
  let component: SolicitarContraseniaPage;
  let fixture: ComponentFixture<SolicitarContraseniaPage>;

  // Spies
  let navSpy: jasmine.SpyObj<NavController>;
  let alertasSpy: jasmine.SpyObj<AlertasService>;
  let restSpy: jasmine.SpyObj<RestApiService>;
  let storageSpy: jasmine.SpyObj<StorageService>;

  beforeEach(waitForAsync(() => {
    navSpy = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack', 'navigateRoot']);
    alertasSpy = jasmine.createSpyObj('AlertasService', ['presentLoading', 'dismissLoading', 'presentarAlerta']);
    restSpy = jasmine.createSpyObj('RestApiService', ['solicitarContrasenia', 'postApi']);
    storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);

    // valores por defecto usados en ngOnInit / flujos
    storageSpy.getItem.and.returnValue(Promise.resolve('SOLICITAR'));
    restSpy.solicitarContrasenia.and.returnValue(Promise.resolve({ exitoso: true }));
    restSpy.postApi.and.returnValue(Promise.resolve({ exitoso: true }));

    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        // 👇 Importar el componente standalone en lugar de declararlo
        SolicitarContraseniaPage,
      ],
      providers: [
        { provide: NavController, useValue: navSpy },
        { provide: AlertasService, useValue: alertasSpy },
        { provide: RestApiService, useValue: restSpy },
        { provide: StorageService, useValue: storageSpy },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SolicitarContraseniaPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
