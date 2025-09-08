import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultimediaModalPage } from './multimedia-modal.page';

describe('DetalleVisitaPage', () => {
  let component: MultimediaModalPage;
  let fixture: ComponentFixture<MultimediaModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultimediaModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MultimediaModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
