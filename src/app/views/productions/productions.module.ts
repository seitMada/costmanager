import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductionsRoutingModule } from './productions-routing.module';

import { CommandeProductionsComponent } from "./commande-productions/commande-productions.component";
import { LivraisonProductionsComponent } from "./livraison-productions/livraison-productions.component";
import { PreparationProductionsComponent } from "./preparation-productions/preparation-productions.component";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProductionsRoutingModule,
    CommandeProductionsComponent,
    LivraisonProductionsComponent,
    PreparationProductionsComponent
  ]
})
export class ProductionsModule { }
