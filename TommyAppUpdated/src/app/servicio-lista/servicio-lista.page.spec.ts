import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ServicioListaPage } from './servicio-lista.page';

describe('ServicioListaPage', () => {
    let component: ServicioListaPage;
    let fixture: ComponentFixture<ServicioListaPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ServicioListaPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ServicioListaPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
