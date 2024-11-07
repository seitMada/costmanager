import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommandeProductionsComponent } from "./commande-productions/commande-productions.component";
import { LivraisonProductionsComponent } from "./livraison-productions/livraison-productions.component";
import { PreparationProductionsComponent } from "./preparation-productions/preparation-productions.component";
import { loginGuard } from 'src/app/login/login.guard';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Productions',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'productions',
      },
      {
        path: 'commandes',
        component: CommandeProductionsComponent,
        data: {
          title: 'Commandes productions',
        },
        canActivate: [loginGuard]
      },
      {
        path: 'livraisons',
        component: LivraisonProductionsComponent,
        data: {
          title: 'Livraisons productions',
        },
        canActivate: [loginGuard]
      },
      {
        path: 'preparations',
        component: PreparationProductionsComponent,
        data: {
          title: 'Preparations productions',
        },
        canActivate: [loginGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionsRoutingModule { }
