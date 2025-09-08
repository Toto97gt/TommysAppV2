import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ServicioAgendarPage } from './servicio-agendar.page';


describe('ServicioAgendarPage', () => {
    let component: ServicioAgendarPage;
    let fixture: ComponentFixture<ServicioAgendarPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ServicioAgendarPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ServicioAgendarPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
