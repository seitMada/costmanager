import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginGuard } from "../../login/login.guard";

import { ArticlesComponent } from "./articles/articles.component";
import { FicheTechniqueComponent } from "./fiche_technique/fiche-technique.component";
import { FournisseursComponent } from "./fournisseurs/fournisseurs.component";
import { GestionStockMinimumComponent } from "./gestion_stock/gestion-stock-minimum/gestion-stock-minimum.component";
import { MouvementStockComponent } from "./gestion_stock/mouvement-stock/mouvement-stock.component";
import { StockMinimumComponent } from "./gestion_stock/stock-minimum/stock-minimum.component";
import { ZoneStockageComponent } from "./gestion_stock/zone-stockage/zone-stockage.component";
import { MatriceSaisieComponent } from "./matrice-saisie/matrice-saisie.component";
import { SyntheseFicheTechniqueComponent } from "./synthese-fiche-technique/synthese-fiche-technique.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Donnée de Base',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'articles'
      },
      {
        path: 'articles',
        component: ArticlesComponent,
        data: {
          title: 'Articles',
        },
        canActivate:[loginGuard]
      },
      {
        path: 'fichetechnique',
        component: FicheTechniqueComponent,
        data: {
          title: 'Fiche techniques',
        },
        canActivate:[loginGuard]
      },
      {
        path: 'fournisseurs',
        component: FournisseursComponent,
        data: {
          title: 'Fournisseurs',
        },
        canActivate:[loginGuard]
      },
      {
        path: 'gestion_stock',
        data: {
          title: 'Gestion de stock',
        },
        children: [{
          path: 'mouvement_stock',
          component: MouvementStockComponent,
          data: {
            title: 'Mouvements stocks',
          },
          canActivate:[loginGuard]
        },
        {
          path: 'gestion_stock_minimum',
          component: GestionStockMinimumComponent,
          data: {
            title: 'Gestions Stock Minimum',
          },
          canActivate:[loginGuard]
        },
        {
          path: 'stock_minimum',
          component: StockMinimumComponent,
          data: {
            title: 'Stock Minimum',
          },
          canActivate:[loginGuard]
        },
        {
          path: 'zones_stockages',
          component: ZoneStockageComponent,
          data: {
            title: 'Zones de stockages',
          },
          canActivate:[loginGuard]
        }]
      },
      {
        path: 'synthese_ft',
        component: SyntheseFicheTechniqueComponent,
        data: {
          title: 'Synthese Fiche Techniques',
        },
        canActivate:[loginGuard]
      },
      {
        path: 'matrice_saisie',
        component: MatriceSaisieComponent,
        data: {
          title: 'Matrices de saisie',
        },
        canActivate:[loginGuard]
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaseRoutingModule { }

