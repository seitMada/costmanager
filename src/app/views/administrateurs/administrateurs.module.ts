import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrateursRoutingModule } from './administrateurs-routing.module';

import { GestionUtilisateursComponent } from "./gestion-utilisateurs/gestion-utilisateurs.component";
import { PrixArticlesComponent } from "./prix-articles/prix-articles.component";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdministrateursRoutingModule,
    GestionUtilisateursComponent,
    PrixArticlesComponent
  ]
})
export class AdministrateursModule { }
