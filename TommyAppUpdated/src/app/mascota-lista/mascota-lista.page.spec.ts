import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MascotaListaPage } from './mascota-lista.page';

describe('MascotaListaPage', () => {
    let component: MascotaListaPage;
    let fixture: ComponentFixture<MascotaListaPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MascotaListaPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(MascotaListaPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
