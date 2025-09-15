import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    // {
    //     path: '',
    //     redirectTo: 'ingreso',
    //     pathMatch: 'full'
    // },
    {
        path: 'ingreso',
        loadChildren: () => import('./ingreso/ingreso.module').then(m => m.IngresoPageModule)
    },
    {
        path: 'inicio',
        loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioPageModule)
    },
    {
        path: 'registro',
        loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule)
    },
    {
        path: 'solicitar-contrasenia',
        loadChildren: () => import('./solicitar-contrasenia/solicitar-contrasenia.module').then(m => m.SolicitarContraseniaPageModule)
    },
    {
        path: 'wizard-datos-usuario',
        loadChildren: () => import('./wizard-datos-usuario/wizard-datos-usuario.module').then(m => m.WizardDatosUsuarioPageModule)
    },
    {
        path: 'wizard-datos-mascota',
        loadChildren: () => import('./wizard-datos-mascota/wizard-datos-mascota.module').then(m => m.WizardDatosMascotaPageModule)
    },
    {
        path: 'mascota-lista',
        loadChildren: () => import('./mascota-lista/mascota-lista.module').then(m => m.MascotaListaPageModule)
    },
    {
        path: 'servicio-lista',
        loadChildren: () => import('./servicio-lista/servicio-lista.module').then(m => m.ServicioListaPageModule)
    },
    {
        path: 'servicio-agendar',
        loadChildren: () => import('./servicio-agendar/servicio-agendar.module').then(m => m.ServicioAgendarPageModule)
    },
    {
        path: 'servicio-solicitar',
        loadChildren: () => import('./servicio-solicitar/servicio-solicitar.module').then(m => m.ServicioSolicitarPageModule)
    },
    {
        path: 'servicio-detalle',
        loadChildren: () => import('./servicio-detalle/servicio-detalle.module').then(m => m.ServicioDetallePageModule)
    },
    {
        path: 'notificacion-lista',
        loadChildren: () => import('./notificacion-lista/notificacion-lista.module').then(m => m.NotificacionListaPageModule)
    },
    {
        path: 'tienda-lista',
        loadChildren: () => import('./tienda-lista/tienda-lista.module').then(m => m.TiendaListaPageModule)
    },
    {
        path: 'servicio-multimedia',
        loadChildren: () => import('./servicio-multimedia/servicio-multimedia.module').then(m => m.ServicioMultimediaPageModule)
    },
    {
        path: 'servicio-terminos',
        loadChildren: () => import('./servicio-terminos/servicio-terminos.module').then(m => m.ServicioTerminosPageModule)
    },
    {
        path: 'tabs-inicio',
        loadChildren: () => import('./tabs-inicio/tabs-inicio.module').then(m => m.TabsInicioPageModule)
    },
    {
        path: 'tabs-servicio',
        loadChildren: () => import('./tabs-servicio/tabs-servicio.module').then(m => m.TabsServicioPageModule)
    },
    {
        path: 'albergue-mascotas',
        loadChildren: () => import('./albergue-mascotas/albergue-mascotas.module').then(m => m.AlbergueMascotasPageModule)
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }