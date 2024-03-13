import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GestionUtilisateursComponent } from "./gestion-utilisateurs/gestion-utilisateurs.component";
import { PrixArticlesComponent } from "./prix-articles/prix-articles.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Paramétres',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'settings',
      },
      {
        path: 'users',
        component: GestionUtilisateursComponent,
        data: {
          title: 'Gestions utilisateurs',
        },
      },
      {
        path: 'articles',
        component: PrixArticlesComponent,
        data: {
          title: 'Prix Articles',
        },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrateursRoutingModule { }
