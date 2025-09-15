import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TabsServicioPage } from './tabs-servicio.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsServicioPage,
        children: [
            {
                path: 'agendar',
                loadChildren: () => import('../servicio-agendar/servicio-agendar.module').then(m => m.ServicioAgendarPageModule)
            },
            {
                path: 'lista',
                loadChildren: () => import('../servicio-lista/servicio-lista.module').then(m => m.ServicioListaPageModule)
            }
        ]
    },
    {
        path: '',
        redirectTo: 'tabs/agendar',
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
    declarations: [TabsServicioPage]
})
export class TabsServicioPageModule { }
