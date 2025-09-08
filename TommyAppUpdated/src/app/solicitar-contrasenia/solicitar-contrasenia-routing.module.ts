import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitarContraseniaPage } from './solicitar-contrasenia.page';

const routes: Routes = [
    {
        path: '',
        component: SolicitarContraseniaPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SolicitarContraseniaPageRoutingModule { }
