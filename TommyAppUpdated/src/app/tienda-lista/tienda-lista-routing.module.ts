import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiendaListaPage } from './tienda-lista.page';

const routes: Routes = [
    {
        path: '',
        component: TiendaListaPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TiendaListaPageRoutingModule { }
