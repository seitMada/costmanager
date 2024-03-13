import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PposComponent } from "./ppos/ppos.component";
import { SynthesePposComponent } from "./synthese-ppos/synthese-ppos.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Pertes',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'ppo',
      },
      {
        path: 'ppo',
        component: PposComponent,
        data: {
          title: 'Pertes',
        },
      },
      {
        path: 'synthese_ppo',
        component: SynthesePposComponent,
        data: {
          title: 'Synthese pertes',
        },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PposRoutingModule { }
