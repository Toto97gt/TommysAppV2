import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicioTerminosPage } from './servicio-terminos.page';

const routes: Routes = [
  {
    path: '',
    component: ServicioTerminosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicioTerminosPageRoutingModule {}
