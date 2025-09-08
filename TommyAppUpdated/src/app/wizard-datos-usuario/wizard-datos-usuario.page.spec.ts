import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WizardDatosUsuarioPage } from './wizard-datos-usuario.page';

describe('WizardDatosUsuarioPage', () => {
  let component: WizardDatosUsuarioPage;
  let fixture: ComponentFixture<WizardDatosUsuarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardDatosUsuarioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WizardDatosUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
