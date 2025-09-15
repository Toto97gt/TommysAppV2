import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbergueMascotasPage } from './albergue-mascotas.page';

const routes: Routes = [
  {
    path: '',
    component: AlbergueMascotasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlbergueMascotasPageRoutingModule {}
