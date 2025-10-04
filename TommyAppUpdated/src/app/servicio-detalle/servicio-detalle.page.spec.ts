import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ServicioDetallePage } from './servicio-detalle.page';
import { ConnectionStatus } from 'src/services/network.service';

// Spies / stubs de servicios usados por el componente
const alertasSpy = jasmine.createSpyObj('AlertasService', [
  'presentLoading',
  'dismissLoading',
  'presentarAlerta',
]);
const restApiSpy = jasmine.createSpyObj('RestApiService', ['postApi']);
const multimediaSpy = jasmine.createSpyObj('MultimediaService', [
  'existeArchivo',
  'descargar',
  'capturarFotoUrl',
  'capturarVideoUrl',
]);
const storageSpy = jasmine.createSpyObj('StorageService', [
  'getItem',
  'getItemObject',
  'setItemObject',
  'removeItem',
]);
const networkStub = {
  getCurrentNetworkStatus: () => ConnectionStatus.Online,
};

// Valores por defecto para métodos async usados en el init/flujo
storageSpy.getItem.and.returnValue(Promise.resolve(null));
storageSpy.getItemObject.and.returnValue(Promise.resolve(null));
multimediaSpy.existeArchivo.and.returnValue(Promise.resolve({ existe: false }));

describe('ServicioDetallePage (standalone)', () => {
  let component: ServicioDetallePage;
  let fixture: ComponentFixture<ServicioDetallePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      // 👉 Standalone: se importa el componente (no va en declarations)
      imports: [IonicModule.forRoot(), ServicioDetallePage],
      providers: [
        { provide: 'AlertasService', useValue: alertasSpy },
        { provide: 'RestApiService', useValue: restApiSpy },
        { provide: 'MultimediaService', useValue: multimediaSpy },
        { provide: 'StorageService', useValue: storageSpy },
        { provide: 'NetworkService', useValue: networkStub },
      ] as any, // 'as any' por si los tokens son clases reales en tu proyecto
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ServicioDetallePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});