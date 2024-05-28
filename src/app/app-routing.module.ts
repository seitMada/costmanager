import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { loginGuard } from "./login/login.guard";

import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dash',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Costmanager'
    },
    canActivate:[loginGuard],
    canActivateChild:[loginGuard],
    children: [
      {
        path: 'donnee_de_base',
        loadChildren: () =>
          import('./views/donnee_de_base/base.module').then((m) => m.BaseModule)
      },
      {
        path: 'dash',
        loadChildren: () =>
          import('./views/dash/dash.module').then((m) => m.DashModule)
      },
      {
        path: 'achats',
        loadChildren: () =>
          import('./views/achats/achats.module').then((m) => m.AchatsModule)
      },
      {
        path: 'vente',
        loadChildren: () =>
          import('./views/ventes/ventes.module').then((m) => m.VentesModule)
      },
      {
        path: 'productions',
        loadChildren: () =>
          import('./views/productions/productions.module').then((m) => m.ProductionsModule)
      },
      {
        path: 'transferts',
        loadChildren: () =>
          import('./views/transferts/transferts.module').then((m) => m.TransfertsModule)
      },
      {
        path: 'inventaires',
        loadChildren: () =>
          import('./views/inventaires/inventaires.module').then((m) => m.InventairesModule)
      },
      {
        path: 'ppo',
        loadChildren: () =>
          import('./views/ppos/ppos.module').then((m) => m.PposModule)
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./views/administrateurs/administrateurs.module').then((m) => m.AdministrateursModule)
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Home'
    }
  },
  {path: '**', redirectTo: 'dash'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppRoutingModule {
}
