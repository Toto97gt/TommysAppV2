import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MascotaListaPage } from './mascota-lista.page';

const routes: Routes = [
  {
    path: '',
    component: MascotaListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MascotaListaPageRoutingModule {}
