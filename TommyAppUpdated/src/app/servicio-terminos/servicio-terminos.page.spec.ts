import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServicioTerminosPage } from './servicio-terminos.page';
import { StorageService } from 'src/services/storage.service';

describe('ServicioTerminosPage (standalone)', () => {
  let component: ServicioTerminosPage;
  let fixture: ComponentFixture<ServicioTerminosPage>;

  // Mock básico del StorageService
  const storageSpy = jasmine.createSpyObj<StorageService>('StorageService', ['getItem']);
  storageSpy.getItem.and.returnValue(Promise.resolve('Términos de prueba'));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      // 👇 Standalone component va en imports, no en declarations
      imports: [IonicModule.forRoot(), ServicioTerminosPage],
      providers: [{ provide: StorageService, useValue: storageSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicioTerminosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
