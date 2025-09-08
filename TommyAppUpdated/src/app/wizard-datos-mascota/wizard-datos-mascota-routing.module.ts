import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WizardDatosMascotaPage } from './wizard-datos-mascota.page';

const routes: Routes = [
    {
        path: '',
        component: WizardDatosMascotaPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WizardDatosMascotaPageRoutingModule { }
