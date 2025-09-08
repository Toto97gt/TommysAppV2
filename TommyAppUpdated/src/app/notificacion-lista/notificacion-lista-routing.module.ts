import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificacionListaPage } from './notificacion-lista.page';

const routes: Routes = [
    {
        path: '',
        component: NotificacionListaPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NotificacionListaPageRoutingModule { }
