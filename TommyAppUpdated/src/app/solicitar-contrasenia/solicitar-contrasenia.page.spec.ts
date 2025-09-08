import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SolicitarContraseniaPage } from './solicitar-contrasenia.page';

describe('SolicitarContraseniaPage', () => {
    let component: SolicitarContraseniaPage;
    let fixture: ComponentFixture<SolicitarContraseniaPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SolicitarContraseniaPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(SolicitarContraseniaPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
