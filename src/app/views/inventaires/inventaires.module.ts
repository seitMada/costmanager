import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventairesRoutingModule } from './inventaires-routing.module';

import { InventairesComponent } from "./inventaires/inventaires.component";
import { CreationInventairesComponent } from "./creation-inventaires/creation-inventaires.component";
import { defineLocale, frLocale } from 'ngx-bootstrap/chronos';


defineLocale('fr', frLocale);


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InventairesRoutingModule,
    InventairesComponent,
    CreationInventairesComponent
  ]
})
export class InventairesModule { }
