import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginGuard } from "../../login/login.guard";

import { DashComponent } from "./dash.component";

const routes: Routes = [
  {
    path: '',
    component: DashComponent,
    data: {
      title: $localize`Dashboard`
    },
    canActivate:[loginGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashRoutingModule {}

