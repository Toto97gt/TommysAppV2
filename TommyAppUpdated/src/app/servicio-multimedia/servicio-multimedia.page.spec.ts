import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ServicioMultimediaPage } from './servicio-multimedia.page';

describe('ServicioMultimediaPage', () => {
  let component: ServicioMultimediaPage;
  let fixture: ComponentFixture<ServicioMultimediaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ServicioMultimediaPage], // ⬅️ standalone: se importa el componente
    }).compileComponents();

    fixture = TestBed.createComponent(ServicioMultimediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});