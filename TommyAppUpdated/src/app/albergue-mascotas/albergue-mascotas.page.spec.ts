import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AlbergueMascotasPage } from './albergue-mascotas.page';

describe('AlbergueMascotasPage', () => {
    let component: AlbergueMascotasPage;
    let fixture: ComponentFixture<AlbergueMascotasPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AlbergueMascotasPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(AlbergueMascotasPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
