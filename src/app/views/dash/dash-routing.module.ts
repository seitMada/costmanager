import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashComponent } from "./dash/dash.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Dashboard',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dash',
      },
      {
        path: 'dash',
        component: DashComponent,
        data: {
          title: 'Dashboard',
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

