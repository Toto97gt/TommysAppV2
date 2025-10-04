import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { InicioPage } from './inicio.page';
import { StorageService } from 'src/services/storage.service';

describe('InicioPage', () => {
  let component: InicioPage;
  let fixture: ComponentFixture<InicioPage>;

  beforeEach(waitForAsync(() => {
    const navSpy = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateRoot']);
    const storageStub: Partial<StorageService> = {
      // flags usados en la página
      tieneRolAseo: false,
      tieneRolPiloto: false,
      // métodos usados en la página
      setItem: jasmine.createSpy('setItem').and.returnValue(Promise.resolve()),
      clear: jasmine.createSpy('clear').and.returnValue(Promise.resolve()),
    } as any;

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), InicioPage],
      providers: [
        { provide: NavController, useValue: navSpy },
        { provide: StorageService, useValue: storageStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});