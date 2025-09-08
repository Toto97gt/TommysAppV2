import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsServicioPage } from './tabs-servicio.page';

describe('TabsServicioPage', () => {
    let component: TabsServicioPage;
    let fixture: ComponentFixture<TabsServicioPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TabsServicioPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TabsServicioPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
