import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BonCommandeTransfertsComponent } from "./bon-commande-transferts/bon-commande-transferts.component";
import { BonLivraisonTransfertsComponent } from "./bon-livraison-transferts/bon-livraison-transferts.component";
import { BonRetourTransfertsComponent } from "./bon-retour-transferts/bon-retour-transferts.component";
import { CommandeTransfertsComponent } from "./commande-transferts/commande-transferts.component";
import { SuiviTransfertComponent } from "./suivi-transfert/suivi-transfert.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Transferts',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'transferts',
      },
      {
        path: 'bon_commandes',
        component: BonCommandeTransfertsComponent,
        data: {
          title: 'Bon de commande transferts',
        },
      },
      {
        path: 'bon_livraisons',
        component: BonLivraisonTransfertsComponent,
        data: {
          title: 'Bon de livraison transferts',
        },
      },
      {
        path: 'bon_retours',
        component: BonRetourTransfertsComponent,
        data: {
          title: 'Bon de retour transferts',
        },
      },
      {
        path: 'commande_transferts',
        component: CommandeTransfertsComponent,
        data: {
          title: 'Commande transferts',
        },
      },
      {
        path: 'suivi_transferts',
        component: SuiviTransfertComponent,
        data: {
          title: 'Suivi transferts',
        },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransfertsRoutingModule { }
