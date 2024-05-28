import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VenteComponent } from './vente/vente.component';


const routes: Routes = [
  {
    path: '',
    component: VenteComponent,
    data: {
      title: 'Ventes',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentesRoutingModule { }
