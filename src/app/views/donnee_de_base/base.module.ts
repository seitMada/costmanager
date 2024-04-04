import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// // views
import { ArticlesComponent } from "./articles/articles.component";
import { FicheTechniqueComponent } from "./fiche_technique/fiche-technique.component";
import { FournisseursComponent } from "./fournisseurs/fournisseurs.component";
import { GestionStockMinimumComponent } from "./gestion_stock/gestion-stock-minimum/gestion-stock-minimum.component";
import { MouvementStockComponent } from "./gestion_stock/mouvement-stock/mouvement-stock.component";
import { StockMinimumComponent } from "./gestion_stock/stock-minimum/stock-minimum.component";
import { ZoneStockageComponent } from "./gestion_stock/zone-stockage/zone-stockage.component";
import { MatriceSaisieComponent } from "./matrice-saisie/matrice-saisie.component";
import { SyntheseFicheTechniqueComponent } from "./synthese-fiche-technique/synthese-fiche-technique.component";

import { defineLocale, frLocale } from 'ngx-bootstrap/chronos';

// Components Routing
import { BaseRoutingModule } from './base-routing.module';

defineLocale('fr', frLocale);

@NgModule({
  imports: [
    CommonModule,
    BaseRoutingModule,
    ReactiveFormsModule,
    ArticlesComponent,
    FicheTechniqueComponent,
    FournisseursComponent,
    GestionStockMinimumComponent,
    MouvementStockComponent,
    StockMinimumComponent,
    ZoneStockageComponent,
    MatriceSaisieComponent,
    SyntheseFicheTechniqueComponent,
  ],
  declarations: [
    
  ],
})
export class BaseModule {}
