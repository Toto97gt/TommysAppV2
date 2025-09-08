import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ServicioDetallePage } from './servicio-detalle.page';

describe('ServicioDetallePage', () => {
    let component: ServicioDetallePage;
    let fixture: ComponentFixture<ServicioDetallePage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ServicioDetallePage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ServicioDetallePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
