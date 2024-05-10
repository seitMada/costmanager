import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GestionUtilisateursComponent } from "./gestion-utilisateurs/gestion-utilisateurs.component";
import { ExploitationsComponent } from "./exploitations/exploitations.component";
import { PrixArticlesComponent } from "./prix-articles/prix-articles.component";
import { CentrerevenusComponent } from './centrerevenus/centrerevenus.component';

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
        path: 'options/exploitation',
        component: ExploitationsComponent,
        data: {
          title: 'Gestions d\'exploitation',
        },
      },
      {
        path: 'options/centrerevenu',
        component: CentrerevenusComponent,
        data: {
          title: 'Centre Revenu',
        },
      },
      {
        path: 'options/user',
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
