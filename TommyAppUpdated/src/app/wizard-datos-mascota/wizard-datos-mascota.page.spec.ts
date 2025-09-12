import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WizardDatosMascotaPage } from './wizard-datos-mascota.page';

describe('WizardDatosMascotaPage', () => {
    let component: WizardDatosMascotaPage;
    let fixture: ComponentFixture<WizardDatosMascotaPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [WizardDatosMascotaPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(WizardDatosMascotaPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
