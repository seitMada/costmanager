import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrateursRoutingModule } from './administrateurs-routing.module';

import { GestionUtilisateursComponent } from "./gestion-utilisateurs/gestion-utilisateurs.component";
import { PrixArticlesComponent } from "./prix-articles/prix-articles.component";
import { ExploitationsComponent } from './exploitations/exploitations.component';
import { CentrerevenusComponent } from './centrerevenus/centrerevenus.component';

import { defineLocale, frLocale } from 'ngx-bootstrap/chronos';
import { ReactiveFormsModule } from '@angular/forms';

defineLocale('fr', frLocale);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdministrateursRoutingModule,
    ReactiveFormsModule,
    GestionUtilisateursComponent,
    CentrerevenusComponent,
    ExploitationsComponent,
    PrixArticlesComponent
  ]
})
export class AdministrateursModule { }
