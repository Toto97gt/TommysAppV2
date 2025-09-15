import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbergueListaPage } from './albergue-lista.page';

const routes: Routes = [
  {
    path: '',
    component: AlbergueListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlbergueListaPageRoutingModule {}
