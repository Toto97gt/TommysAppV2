import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ServicioSolicitarPage } from './servicio-solicitar.page';

describe('ServicioSolicitarPage', () => {
    let component: ServicioSolicitarPage;
    let fixture: ComponentFixture<ServicioSolicitarPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ServicioSolicitarPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ServicioSolicitarPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
