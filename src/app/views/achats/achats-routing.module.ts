import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SimulationAchatsComponent } from "./simulation-achats/simulation-achats.component";
import { MercurialesComponent } from "./mercuriales/mercuriales.component";
import { BonCommandeAchatsComponent } from "./bon-commande-achats/bon-commande-achats.component";
import { BonLivraisonAchatsComponent } from "./bon-livraison-achats/bon-livraison-achats.component";
import { FacturesComponent } from "./factures/factures.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Achats',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'achats',
      },
      {
        path: 'simulations',
        component: SimulationAchatsComponent,
        data: {
          title: 'Simulations achats',
        },
      },
      {
        path: 'mercuriales',
        component: MercurialesComponent,
        data: {
          title: 'Mercuriales',
        },
      },
      {
        path: 'bon_commande',
        component: BonCommandeAchatsComponent,
        data: {
          title: 'Bon de commandes',
        },
      },
      {
        path: 'bon_livraison',
        component: BonLivraisonAchatsComponent,
        data: {
          title: 'Bon de livraisons',
        },
      },
      {
        path: 'factures',
        component: FacturesComponent,
        data: {
          title: 'Factures',
        },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AchatsRoutingModule { }
