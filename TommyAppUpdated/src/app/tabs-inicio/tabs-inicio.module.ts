import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TabsInicioPage } from './tabs-inicio.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsInicioPage,
        children: [
            {
                path: 'notificaciones',
                loadChildren: () => import('../notificacion-lista/notificacion-lista.module').then(m => m.NotificacionListaPageModule)
            },
            {
                path: 'inicio',
                loadChildren: () => import('../inicio/inicio.module').then(m => m.InicioPageModule)
            },
            {
                path: 'albergue-lista',
                loadChildren: () => import('../albergue-lista/albergue-lista.module').then(m => m.AlbergueListaPageModule)
            }
        ]
    },
    {
        path: '',
        redirectTo: 'tabs/inicio',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [TabsInicioPage]
})
export class TabsInicioPageModule { }
