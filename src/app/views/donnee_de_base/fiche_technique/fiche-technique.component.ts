import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';

import { FichetechniqueService } from "../../../shared/service/fichetechnique.service";
import { ActivatedRoute, Router } from '@angular/router';

import { InterfaceFichetechnique } from "../../../shared/model/interface-fichetechnique";
import { Fichetechnique } from "../../../shared/model/fichetechniques";

@Component({
  selector: 'app-fiche-technique',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDropdownModule],
  templateUrl: './fiche-technique.component.html',
  styleUrl: './fiche-technique.component.scss'
})
export class FicheTechniqueComponent implements OnInit {

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private fichetechniqueService: FichetechniqueService,
    // private uniteService: UnitesService,
    // private categoriesService: CategoriesService,
    // private groupeService: GroupeAnalytiqueService,
    // private familleService: FamillesService,
    // private sousFamilleService: SousfamillesService,
    // private exploitationService: ExploitationService,
    // private allergeneService: AllergenesService
  ) { }

  public toggle = true;
  public modifToggle = true;
  public exploitationToggle = true;

  public fichetetchniques: Fichetechnique;
  public fichetetchnique: InterfaceFichetechnique;
  
  public exploitation = +(sessionStorage.getItem('exploitation') || 3);

  ngOnInit(): void {
    this.initFichetechnique();
  }

  initFichetechnique() {
    forkJoin({
      fichetechniqueByExploitation: this.fichetechniqueService.getFichetechniqueByExploitation(this.exploitation)
    }).subscribe({
      next: (data) => {
        const { fichetechniqueByExploitation } = data;
        this.fichetetchniques = fichetechniqueByExploitation;
        console.log(this.fichetetchniques)
      }
    })
  }

  show(data: any) {
    // this.toggle = !this.toggle;
    console.log(data)
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

  }

  addToggleModal() {

  }

}
