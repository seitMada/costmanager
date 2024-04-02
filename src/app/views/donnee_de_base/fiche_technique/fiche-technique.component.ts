import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { FichetechniqueService } from "../../../shared/service/fichetechnique.service";
import { ActivatedRoute, Router } from '@angular/router';

import { InterfaceFichetechnique } from "../../../shared/model/interface-fichetechnique";
import { Fichetechnique } from "../../../shared/model/fichetechniques";
import { InterfaceFamilles, InterfaceFamilless } from '../../../shared/model/interface-familles';
import { Famille, Familles } from "../../../shared/model/familles";
import { FamillesService } from '../../../shared/service/familles.service';
import { GroupeAnalytiqueService } from '../../../shared/service/groupe-analytique.service';
import { Groupeanalytiques } from "../../../shared/model/groupeanalytiques";
import { CategoriesService } from "../../../shared/service/categories.service";
import { Categories } from "../../../shared/model/categories";
import { Unites } from "../../../shared/model/unite";
import { UnitesService } from "../../../shared/service/unites.service";
import { InterfaceUnite } from '../../../shared/model/interface-unite';
import { InterfaceGroupeanalytiques } from '../../../shared/model/interface-groupeanalytiques';
import { InterfaceCategories } from 'src/app/shared/model/interface-categories';

@Component({
  selector: 'app-fiche-technique',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDropdownModule, BsDatepickerModule],
  templateUrl: './fiche-technique.component.html',
  styleUrl: './fiche-technique.component.scss'
})
export class FicheTechniqueComponent implements OnInit {

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private fichetechniqueService: FichetechniqueService,
    private uniteService: UnitesService,
    private categoriesService: CategoriesService,
    private groupeService: GroupeAnalytiqueService,
    private familleService: FamillesService,
    // private sousFamilleService: SousfamillesService,
    // private exploitationService: ExploitationService,
    // private allergeneService: AllergenesService
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
  }

  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };

  public toggle = true;
  public modifToggle = true;
  public exploitationToggle = true;

  public fichetetchniques: Fichetechnique;
  public fichetetchnique: InterfaceFichetechnique;
  public familles: Familles;
  public categories: Categories;
  public unites: Unites;
  public groupeanalytiques: Groupeanalytiques;

  private today = new Date();
  
  public dates = {
    debut: new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate()),
    fin: this.today
  }
  public exploitation = +(sessionStorage.getItem('exploitation') || 3);

  ngOnInit(): void {
    this.initFichetechnique();
  }

  initFichetechnique() {
    forkJoin({
      fichetechniqueByExploitation: this.fichetechniqueService.getFichetechniqueByExploitation(this.exploitation),
      groupeanalytique: this.groupeService.getGroupeAnalytique(),
      categorie: this.categoriesService.getCategories(),
      unite: this.uniteService.getUnite()
    }).subscribe({
      next: (data) => {
        const { fichetechniqueByExploitation, groupeanalytique, categorie, unite } = data;
        this.fichetetchniques = fichetechniqueByExploitation;
        this.categories = categorie;
        this.groupeanalytiques = groupeanalytique;
        this.unites = unite;
      }
    })
  }

  show(fichetetchnique: any) {
    // this.toggle = !this.toggle;
    this.fichetetchnique = fichetetchnique;
    const dat = {
      groupeId: this.fichetetchnique.groupeanalytiqueId,
      type: 'A'
    }
    forkJoin({
      familles: this.familleService.getFamilleByGroupe(dat)
    }).subscribe({
      next: (data) => {
        const { familles } = data;
        this.familles = familles;
      }
    })
  }

  submit() {

  }

  cancel() {

  }

  delete() {

  }

  deletes() {

  }

  toggleModal() {
    this.toggle = !this.toggle;
    this.initFichetechnique();
  }

  modifToggleModal() {
    this.modifToggle = !this.modifToggle;
  }

  addToggleModal() {

  }

  selectUnite(unite: InterfaceUnite) {
    this.fichetetchnique.uniteId = (unite.id? unite.id : 0);
    this.fichetetchnique.unite = unite;
    console.log(this.fichetetchnique.uniteId)
  }

  selectGroupeanalytique(groupeanalytique: InterfaceGroupeanalytiques) {
    this.fichetetchnique.groupeanalytiqueId = (groupeanalytique.id? groupeanalytique.id : 0);
    this.fichetetchnique.groupeanalytique = groupeanalytique;
    this.fichetetchnique.famille.libelle = '';
    const data = {
      groupeId: groupeanalytique.id,
      type: 'A'
    }
    this.familleService.getFamilleByGroupe(data).subscribe({
      next: (famille) => {
        this.familles = famille;
      },
    })
  }

  selectFamille(famille: InterfaceFamilles) {
    this.fichetetchnique.familleId = (famille.id? famille.id : 0);
    this.fichetetchnique.famille = famille;
  }

  selectCategorie(categorie: InterfaceCategories) {
    this.fichetetchnique.categorieId = (categorie.id? categorie.id : 0);
    this.fichetetchnique.categorie = categorie;
  }

}
