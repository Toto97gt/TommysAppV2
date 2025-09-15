import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicioAgendarPage } from './servicio-agendar.page';

const routes: Routes = [
    {
        path: '',
        component: ServicioAgendarPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ServicioAgendarPageRoutingModule { }
