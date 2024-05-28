import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentesRoutingModule } from './ventes-routing.module';
import { VenteComponent } from './vente/vente.component';

import { defineLocale, frLocale } from 'ngx-bootstrap/chronos';
defineLocale('fr', frLocale);


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    VentesRoutingModule,
    VenteComponent
  ]
})
export class VentesModule { }
