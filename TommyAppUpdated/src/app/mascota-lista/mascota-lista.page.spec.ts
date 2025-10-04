import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { MascotaListaPage } from './mascota-lista.page';

// Servicios a mockear
import { AlertasService } from 'src/services/alertas.service';
import { StorageService } from 'src/services/storage.service';
import { NetworkService } from 'src/services/network.service';
import { MascotaService } from 'src/services/mascota.service';

describe('MascotaListaPage (standalone)', () => {
  let component: MascotaListaPage;
  let fixture: ComponentFixture<MascotaListaPage>;

  // Mocks mínimos
  const navSpy = jasmine.createSpyObj('NavController', ['navigateForward']);
  const alertasSpy = jasmine.createSpyObj('AlertasService', ['presentLoading', 'dismissLoading']);
  const storageSpy = jasmine.createSpyObj('StorageService', ['getItemObject', 'setItem', 'removeItem']);
  const networkSpy = jasmine.createSpyObj('NetworkService', ['getCurrentNetworkStatus']);
  const mascotaSpy = jasmine.createSpyObj('MascotaService', ['obtenerMascotas']);

  beforeEach(waitForAsync(() => {
    // Valores por defecto para evitar promesas sin resolver
    storageSpy.getItemObject.and.returnValue(Promise.resolve(null));
    mascotaSpy.obtenerMascotas.and.returnValue(Promise.resolve([]));
    networkSpy.getCurrentNetworkStatus.and.returnValue(0 as any); // No importa para esta prueba básica

    TestBed.configureTestingModule({
      // ✅ Standalone: va en imports, no en declarations
      imports: [IonicModule.forRoot(), MascotaListaPage],
      providers: [
        { provide: NavController, useValue: navSpy },
        { provide: AlertasService, useValue: alertasSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: NetworkService, useValue: networkSpy },
        { provide: MascotaService, useValue: mascotaSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MascotaListaPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara ngOnInit()
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});