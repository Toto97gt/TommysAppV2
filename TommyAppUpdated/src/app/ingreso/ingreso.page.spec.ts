import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IngresoPage } from './ingreso.page';

describe('IngresoPage', () => {
    let component: IngresoPage;
    let fixture: ComponentFixture<IngresoPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IngresoPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(IngresoPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
