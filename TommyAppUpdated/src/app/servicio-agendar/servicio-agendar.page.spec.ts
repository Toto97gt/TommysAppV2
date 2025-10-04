import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { ServicioAgendarPage } from './servicio-agendar.page';
import { NetworkService, ConnectionStatus } from 'src/services/network.service';
import { RestApiService } from 'src/services/restApi.service';
import { AlertasService } from 'src/services/alertas.service';
import { StorageService } from 'src/services/storage.service';
import { MascotaService } from 'src/services/mascota.service';

describe('ServicioAgendarPage (standalone)', () => {
  let component: ServicioAgendarPage;
  let fixture: ComponentFixture<ServicioAgendarPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      // 👉 Standalone: se importa el componente, no se declara
      imports: [IonicModule.forRoot(), ServicioAgendarPage],
      providers: [
        // Deja OFFLINE para que no llame API en ngOnInit y use storage
        { provide: NetworkService, useValue: { getCurrentNetworkStatus: () => ConnectionStatus.Offline } },
        { provide: RestApiService, useValue: { postApiPublic: () => Promise.resolve({ datos: { tiendas: [] } }) } },
        { provide: AlertasService, useValue: { presentLoading: () => {}, dismissLoading: () => {} } },
        {
          provide: StorageService,
          useValue: {
            tieneRolAseo: false,
            getItemObject: () => Promise.resolve([]),
            getItem: () => Promise.resolve(null),
            setItem: () => Promise.resolve(),
            setItemObject: () => Promise.resolve(),
          },
        },
        { provide: MascotaService, useValue: { obtenerMascotas: () => Promise.resolve([]) } },
        { provide: NavController, useValue: { navigateForward: () => {}, navigateBack: () => {}, navigateRoot: () => {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicioAgendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
