import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InventairesComponent } from "./inventaires/inventaires.component";
import { CreationInventairesComponent } from "./creation-inventaires/creation-inventaires.component";

const routes: Routes = [
  {
    path: '',
    component: InventairesComponent,
    data: {
      title: 'Inventaires',
    },






















  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventairesRoutingModule { }
