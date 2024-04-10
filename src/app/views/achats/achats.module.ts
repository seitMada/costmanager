import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AchatsRoutingModule } from './achats-routing.module';

import { SimulationAchatsComponent } from "./simulation-achats/simulation-achats.component";
import { MercurialesComponent } from "./mercuriales/mercuriales.component";
import { BonCommandeAchatsComponent } from "./bon-commande-achats/bon-commande-achats.component";
import { BonLivraisonAchatsComponent } from "./bon-livraison-achats/bon-livraison-achats.component";
import { FacturesComponent } from "./factures/factures.component";

import { defineLocale, frLocale } from 'ngx-bootstrap/chronos';

defineLocale('fr', frLocale);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AchatsRoutingModule,
    SimulationAchatsComponent,
    MercurialesComponent,
    BonCommandeAchatsComponent,
    BonLivraisonAchatsComponent,
    FacturesComponent,
  ]
})
export class AchatsModule { }
