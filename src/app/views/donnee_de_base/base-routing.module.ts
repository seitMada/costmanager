import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticlesComponent } from "./articles/articles.component";
import { FicheTechniqueComponent } from "./fiche_technique/fiche-technique.component";

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
        redirectTo: 'articles',
      },
      {
        path: 'articles',
        component: ArticlesComponent,
        data: {
          title: 'Articles',
        },
      },
      {
        path: 'fichetechnique',
        component: FicheTechniqueComponent,
        data: {
          title: 'Fiche techniques',
        },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaseRoutingModule {}

