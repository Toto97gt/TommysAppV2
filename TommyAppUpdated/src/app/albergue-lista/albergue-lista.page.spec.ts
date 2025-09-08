import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AlbergueListaPage } from './albergue-lista.page';

describe('AlbergueListaPage', () => {
    let component: AlbergueListaPage;
    let fixture: ComponentFixture<AlbergueListaPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AlbergueListaPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(AlbergueListaPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
