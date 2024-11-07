import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VenteComponent } from './vente/vente.component';
import { loginGuard } from 'src/app/login/login.guard';


const routes: Routes = [
  {
    path: '',
    component: VenteComponent,
    data: {
      title: 'Ventes',
    },
    canActivate: [loginGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentesRoutingModule { }
