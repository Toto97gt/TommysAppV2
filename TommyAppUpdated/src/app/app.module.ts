import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { IonicSelectableComponent } from 'ionic-selectable';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      name: '__myapp', // opcional
      // driverOrder: ['sqlite', 'indexeddb', 'localstorage'], // opcional
    }),
    HttpClientModule,
    AppRoutingModule,
    IonicSelectableComponent,
  ],
  providers: [
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // ⚠️ Ya no se registran aquí plugins nativos:
    // Camera, File, FileTransfer, Geolocation, LocalNotifications, Market, etc.
    // Sus equivalentes de Capacitor se usan directamente en tus servicios.
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}