import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransfertsRoutingModule } from './transferts-routing.module';

import { BonCommandeTransfertsComponent } from "./bon-commande-transferts/bon-commande-transferts.component";
import { BonLivraisonTransfertsComponent } from "./bon-livraison-transferts/bon-livraison-transferts.component";
import { BonRetourTransfertsComponent } from "./bon-retour-transferts/bon-retour-transferts.component";
import { CommandeTransfertsComponent } from "./commande-transferts/commande-transferts.component";
import { SuiviTransfertComponent } from "./suivi-transfert/suivi-transfert.component";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TransfertsRoutingModule,
    BonCommandeTransfertsComponent,
    BonLivraisonTransfertsComponent,
    BonRetourTransfertsComponent,
    CommandeTransfertsComponent,
    SuiviTransfertComponent
  ]
})
export class TransfertsModule { }
