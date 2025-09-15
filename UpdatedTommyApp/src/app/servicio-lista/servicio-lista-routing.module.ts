import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicioListaPage } from './servicio-lista.page';

const routes: Routes = [
    {
        path: '',
        component: ServicioListaPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ServicioListaPageRoutingModule { }
