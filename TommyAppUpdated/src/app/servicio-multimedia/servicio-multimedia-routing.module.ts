import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicioMultimediaPage } from './servicio-multimedia.page';

const routes: Routes = [
    {
        path: '',
        component: ServicioMultimediaPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ServicioMultimediaPageRoutingModule { }
