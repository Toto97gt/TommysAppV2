import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicioSolicitarPage } from './servicio-solicitar.page';

const routes: Routes = [
    {
        path: '',
        component: ServicioSolicitarPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ServicioSolicitarPageRoutingModule { }
