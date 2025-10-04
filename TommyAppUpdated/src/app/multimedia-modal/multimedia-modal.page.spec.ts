import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MultimediaModalPage } from './multimedia-modal.page';

describe('MultimediaModalPage', () => {
  let component: MultimediaModalPage;
  let fixture: ComponentFixture<MultimediaModalPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      // Para standalone se importa el componente directamente:
      imports: [MultimediaModalPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MultimediaModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});