import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PposRoutingModule } from './ppos-routing.module';

import { PposComponent } from "./ppos/ppos.component";
import { SynthesePposComponent } from "./synthese-ppos/synthese-ppos.component";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PposRoutingModule,
    PposComponent,
    SynthesePposComponent
  ]
})
export class PposModule { }
