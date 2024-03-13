import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Costmanager'
    },
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
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Home'
    }
  },
  {path: '**', redirectTo: 'login'}
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
