import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GestionUtilisateursComponent } from "./gestion-utilisateurs/gestion-utilisateurs.component";
import { ExploitationsComponent } from "./exploitations/exploitations.component";
import { PrixArticlesComponent } from "../donnee_de_base/gestion_stock/prix-articles/prix-articles.component";
import { CentrerevenusComponent } from './centrerevenus/centrerevenus.component';
import { ZonestockageComponent } from './zonestockage/zonestockage.component';
import { LieustockageComponent } from './lieustockage/lieustockage.component';
import { OptionsComponent } from './options/options.component';
import { loginGuard } from 'src/app/login/login.guard';

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
        path: 'options/',
        component: OptionsComponent,
        data: {
          title: 'Options',
        },
        canActivate: [loginGuard]
      },
      {
        path: 'options/exploitation',
        component: ExploitationsComponent,
        data: {
          title: 'Gestions d\'exploitation',
        },
        canActivate: [loginGuard]
      },
      {
        path: 'options/centrerevenu',
        component: CentrerevenusComponent,
        data: {
          title: 'Centre Revenu',
        },
        canActivate: [loginGuard]
      },
      {
        path: 'options/lieustockage',
        component: LieustockageComponent,
        data: {
          title: 'Lieu de stockage',
        },
        canActivate: [loginGuard]
      },
      {
        path: 'options/zonestockage',
        component: ZonestockageComponent,
        data: {
          title: 'Zone de stockage',
        },
        canActivate: [loginGuard]
      },
      {
        path: 'user',
        component: GestionUtilisateursComponent,
        data: {
          title: 'Gestions utilisateurs',
        },
        canActivate: [loginGuard]
      },
      {
        path: 'option',
        component: OptionsComponent,
        data: {
          title: 'Options',
        },
        canActivate: [loginGuard]
      },
      {
        path: 'articles',
        component: PrixArticlesComponent,
        data: {
          title: 'Prix Articles',
        },
        canActivate: [loginGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrateursRoutingModule { }
