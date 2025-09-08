import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultimediaModalPage } from './multimedia-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MultimediaModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultimediaModalPageRoutingModule {}
