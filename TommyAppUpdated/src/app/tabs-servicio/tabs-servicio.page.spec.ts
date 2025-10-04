import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsServicioPage } from './tabs-servicio.page';
import { StorageService } from 'src/services/storage.service';

describe('TabsServicioPage', () => {
  let component: TabsServicioPage;
  let fixture: ComponentFixture<TabsServicioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsServicioPage], // <-- standalone
      providers: [
        { provide: StorageService, useValue: { tieneRolAseo: false } }, // mock simple
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsServicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('no selecciona "lista" si no tiene rol de aseo', () => {
    component.tabsRef = { select: jasmine.createSpy('select') } as any;
    component.ionViewWillEnter();
    expect((component.tabsRef.select as jasmine.Spy)).not.toHaveBeenCalled();
  });

  it('selecciona "lista" si tiene rol de aseo', () => {
    const storageMock = TestBed.inject(StorageService) as any;
    storageMock.tieneRolAseo = true;

    component.tabsRef = { select: jasmine.createSpy('select') } as any;
    component.ionViewWillEnter();

    expect((component.tabsRef.select as jasmine.Spy)).toHaveBeenCalledWith('lista');
  });
});