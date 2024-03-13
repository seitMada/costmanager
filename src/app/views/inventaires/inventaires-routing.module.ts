import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InventairesComponent } from "./inventaires/inventaires.component";
import { CreationInventairesComponent } from "./creation-inventaires/creation-inventaires.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Inventaires',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inventaires',
      },
      {
        path: 'inventaires',
        component: InventairesComponent,
        data: {
          title: 'Inventaires',
        },
      },
      {
        path: 'creations_inventaires',
        component: CreationInventairesComponent,
        data: {
          title: 'Creations inventaires',
        },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventairesRoutingModule { }
