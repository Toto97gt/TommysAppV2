// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tabs-inicio', pathMatch: 'full' },

  { path: 'ingreso', loadComponent: () => import('./ingreso/ingreso.page').then(m => m.IngresoPage) },
  { path: 'inicio', loadComponent: () => import('./inicio/inicio.page').then(m => m.InicioPage) },
  { path: 'registro', loadComponent: () => import('./registro/registro.page').then(m => m.RegistroPage) },
  { path: 'solicitar-contrasenia', loadComponent: () => import('./solicitar-contrasenia/solicitar-contrasenia.page').then(m => m.SolicitarContraseniaPage) },

  { path: 'wizard-datos-usuario', loadComponent: () => import('./wizard-datos-usuario/wizard-datos-usuario.page').then(m => m.WizardDatosUsuarioPage) },
  { path: 'wizard-datos-mascota', loadComponent: () => import('./wizard-datos-mascota/wizard-datos-mascota.page').then(m => m.WizardDatosMascotaPage) },
  { path: 'mascota-lista', loadComponent: () => import('./mascota-lista/mascota-lista.page').then(m => m.MascotaListaPage) },

  { path: 'servicio-lista', loadComponent: () => import('./servicio-lista/servicio-lista.page').then(m => m.ServicioListaPage) },
  { path: 'servicio-agendar', loadComponent: () => import('./servicio-agendar/servicio-agendar.page').then(m => m.ServicioAgendarPage) },
  { path: 'servicio-solicitar', loadComponent: () => import('./servicio-solicitar/servicio-solicitar.page').then(m => m.ServicioSolicitarPage) },
  { path: 'servicio-detalle', loadComponent: () => import('./servicio-detalle/servicio-detalle.page').then(m => m.ServicioDetallePage) },
  { path: 'servicio-multimedia', loadComponent: () => import('./servicio-multimedia/servicio-multimedia.page').then(m => m.ServicioMultimediaPage) },
  { path: 'servicio-terminos', loadComponent: () => import('./servicio-terminos/servicio-terminos.page').then(m => m.ServicioTerminosPage) },

  { path: 'notificacion-lista', loadComponent: () => import('./notificacion-lista/notificacion-lista.page').then(m => m.NotificacionListaPage) },
  { path: 'tienda-lista', loadComponent: () => import('./tienda-lista/tienda-lista.page').then(m => m.TiendaListaPage) },
  { path: 'albergue-lista', loadComponent: () => import('./albergue-lista/albergue-lista.page').then(m => m.AlbergueListaPage) },
  { path: 'albergue-mascotas', loadComponent: () => import('./albergue-mascotas/albergue-mascotas.page').then(m => m.AlbergueMascotasPage) },

  { path: 'tabs-inicio', loadComponent: () => import('./tabs-inicio/tabs-inicio.page').then(m => m.TabsInicioPage) },
  { path: 'tabs-servicio', loadComponent: () => import('./tabs-servicio/tabs-servicio.page').then(m => m.TabsServicioPage) },
];