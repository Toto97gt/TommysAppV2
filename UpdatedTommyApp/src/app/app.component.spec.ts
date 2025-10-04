import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Platform, NavController, IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';

import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from '@capacitor/core';

import { PermissionService } from 'src/services/permission.service';
import { FCMService } from 'src/services/fcm.service';
import { RestApiService } from 'src/services/restApi.service';
import { StorageService } from 'src/services/storage.service';

describe('AppComponent', () => {
  let platformReadySpy: Promise<void>;
  let platformSpy: jasmine.SpyObj<Platform>;

  let statusBarSetStyleSpy: jasmine.Spy;
  let splashHideSpy: jasmine.Spy;
  let orientationLockSpy: jasmine.Spy;
  let getPlatformSpy: jasmine.Spy;

  let navSpy: jasmine.SpyObj<NavController>;
  let permSpy: jasmine.SpyObj<PermissionService>;
  let fcmSpy: jasmine.SpyObj<FCMService>;

  beforeEach(waitForAsync(() => {
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });

    getPlatformSpy = spyOn(Capacitor, 'getPlatform').and.returnValue('android');

    statusBarSetStyleSpy = spyOn(StatusBar, 'setStyle').and.returnValue(Promise.resolve());
    splashHideSpy = spyOn(SplashScreen, 'hide').and.returnValue(Promise.resolve());
    orientationLockSpy = spyOn(ScreenOrientation, 'lock').and.returnValue(Promise.resolve());

    navSpy = jasmine.createSpyObj<NavController>('NavController', ['navigateRoot']);

    permSpy = jasmine.createSpyObj<PermissionService>('PermissionService', ['getPermisosCorrectos']);
    permSpy.getPermisosCorrectos.and.returnValue(Promise.resolve(true));

    fcmSpy = jasmine.createSpyObj<FCMService>('FCMService', ['inicializar']);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        IonicModule.forRoot(),    
        RouterTestingModule,       
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], 
      providers: [
        { provide: Platform, useValue: platformSpy },
        { provide: NavController, useValue: navSpy },
        { provide: PermissionService, useValue: permSpy },
        { provide: FCMService, useValue: fcmSpy },
        { provide: RestApiService, useValue: {} },
        { provide: StorageService, useValue: {} },
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();

    await platformReadySpy;

    expect(orientationLockSpy).toHaveBeenCalledWith({ orientation: 'portrait' });
    expect(getPlatformSpy).toHaveBeenCalled();
    expect(statusBarSetStyleSpy).toHaveBeenCalledWith({ style: Style.Dark });
    expect(splashHideSpy).toHaveBeenCalled();

    expect(
      (permSpy as any).getPermisosCorrectos
        ? permSpy.getPermisosCorrectos
        : (permSpy as any).solicitarPermisoEscritura
    ).toHaveBeenCalled();

    expect(fcmSpy.inicializar).toHaveBeenCalled();
    expect(navSpy.navigateRoot).toHaveBeenCalledWith('/tabs-inicio');
  });
});