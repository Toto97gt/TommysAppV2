import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotificacionListaPage } from './notificacion-lista.page';

// Mocks simples para los servicios que el componente inyecta
const restApiMock = {
  postApi: jasmine.createSpy('postApi').and.returnValue(Promise.resolve(null)),
  postApiPublic: jasmine.createSpy('postApiPublic').and.returnValue(Promise.resolve(null)),
};

const alertasMock = {
  presentLoading: jasmine.createSpy('presentLoading'),
  dismissLoading: jasmine.createSpy('dismissLoading'),
  presentarAlerta: jasmine.createSpy('presentarAlerta'),
};

const storageMock = {
  getItemObject: jasmine.createSpy('getItemObject').and.returnValue(Promise.resolve(null)),
};

const networkMock = {
  getCurrentNetworkStatus: jasmine.createSpy('getCurrentNetworkStatus').and.returnValue(undefined),
};

describe('NotificacionListaPage (standalone)', () => {
  let component: NotificacionListaPage;
  let fixture: ComponentFixture<NotificacionListaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), NotificacionListaPage],
      providers: [
        { provide: (window as any).RestApiService || class {}, useValue: restApiMock },
        { provide: (window as any).AlertasService || class {}, useValue: alertasMock },
        { provide: (window as any).StorageService || class {}, useValue: storageMock },
        { provide: (window as any).NetworkService || class {}, useValue: networkMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacionListaPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ejecuta ngOnInit
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
