import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TiendaListaPage } from './tienda-lista.page';

// Mocks mínimos para los servicios usados por el componente
const restApiMock = {
  postApiPublic: jasmine.createSpy('postApiPublic')
    .and.returnValue(Promise.resolve({ exitoso: true, datos: { tiendas: [] } }))
};

const alertasMock = {
  presentLoading: jasmine.createSpy('presentLoading'),
  dismissLoading: jasmine.createSpy('dismissLoading')
};

const storageMock = {
  getItemObject: jasmine.createSpy('getItemObject').and.returnValue(Promise.resolve(null)),
  setItemObject: jasmine.createSpy('setItemObject').and.returnValue(Promise.resolve(true))
};

const multimediaMock = {
  existeArchivo: jasmine.createSpy('existeArchivo'),
  descargar: jasmine.createSpy('descargar')
};

// Si tu enum ConnectionStatus.Online === 1, devolvemos 1 para “Online”
const networkMock = {
  getCurrentNetworkStatus: jasmine.createSpy('getCurrentNetworkStatus').and.returnValue(1)
};

const gpsMock = {
  comoLlegar: jasmine.createSpy('comoLlegar')
};

describe('TiendaListaPage', () => {
  let component: TiendaListaPage;
  let fixture: ComponentFixture<TiendaListaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      // Standalone component -> va en imports
      imports: [IonicModule.forRoot(), TiendaListaPage],
      providers: [
        { provide: 'RestApiService', useValue: restApiMock },
        { provide: 'AlertasService', useValue: alertasMock },
        { provide: 'StorageService', useValue: storageMock },
        { provide: 'MultimediaService', useValue: multimediaMock },
        { provide: 'NetworkService', useValue: networkMock },
        { provide: 'GpsService', useValue: gpsMock },
      ] as any
    }).compileComponents();

    fixture = TestBed.createComponent(TiendaListaPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara ngOnInit()
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
