import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicioDetallePage } from './servicio-detalle.page';

const routes: Routes = [
    {
        path: '',
        component: ServicioDetallePage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ServicioDetallePageRoutingModule { }
