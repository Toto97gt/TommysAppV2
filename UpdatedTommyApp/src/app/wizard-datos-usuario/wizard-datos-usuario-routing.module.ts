import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WizardDatosUsuarioPage } from './wizard-datos-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: WizardDatosUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WizardDatosUsuarioPageRoutingModule {}
