import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TabsInicioPage } from './tabs-inicio.page';

describe('TabsInicioPage (standalone)', () => {
  let component: TabsInicioPage;
  let fixture: ComponentFixture<TabsInicioPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      // En standalone, el componente va en `imports`, NO en `declarations`

      imports: [TabsInicioPage, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsInicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();  
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});