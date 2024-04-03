import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbNavModule, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { FichetechniqueService } from "../../../shared/service/fichetechnique.service";
import { ActivatedRoute, Router } from '@angular/router';

import { InterfaceFichetechnique } from "../../../shared/model/interface-fichetechnique";
import { Compositions, Fichetechnique } from "../../../shared/model/fichetechniques";
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
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { Exploitations } from "../../../shared/model/exploitations";
import { Article } from 'src/app/shared/model/articles';
import { ArticleService } from 'src/app/shared/service/article.service';

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
    private articleService: ArticleService,
    private exploitationService: ExploitationService,
    // private allergeneService: AllergenesService
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
  }

  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };

  public toggle = true;
  public modifToggle = true;
  public exploitationToggle = true;

  public articles: Article;
  public fichetechniques: Fichetechnique;
  public fichetechnique: InterfaceFichetechnique;
  public familles: Familles;
  public categories: Categories;
  public unites: Unites;
  public groupeanalytiques: Groupeanalytiques;
  public exploitations: Exploitations;
  public compositions: Compositions;
  public compositionList: [
    {
      libelle: '',
      quantite: 0,
      cout: 0,
      unite: '',
      type: '',
      id: 0
    }
  ];

  private idFichetechnique: number = 0;

  private today = new Date();
  
  public dates = {
    debut: new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate()),
    fin: this.today
  }
  public exploitation = +(sessionStorage.getItem('exploitation') || 3);
  
  private modalService = inject(NgbModal);
  closeResult = '';
  activeComposition = 1;

  ngOnInit(): void {
    this.resetFichetechnique();
    this.initFichetechnique();
  }

  initFichetechnique() {
    forkJoin({
      fichetechniqueByExploitation: this.fichetechniqueService.getFichetechniqueByExploitation(this.exploitation),
      groupeanalytique: this.groupeService.getGroupeAnalytique(),
      categorie: this.categoriesService.getCategories(),
      unite: this.uniteService.getUnite(),
      exploitations: this.exploitationService.getExploitation(),
      articlesByExploitation: this.articleService.getArticlesByExploitation(this.exploitation)
    }).subscribe({
      next: (data) => {
        const { fichetechniqueByExploitation, groupeanalytique, categorie, unite, exploitations, articlesByExploitation } = data;
        this.fichetechniques = fichetechniqueByExploitation;
        this.categories = categorie;
        this.groupeanalytiques = groupeanalytique;
        this.unites = unite;
        this.exploitations = exploitations;
        this.articles = articlesByExploitation;
      }
    })
  }

  show(fichetechnique: InterfaceFichetechnique) {
    this.idFichetechnique = fichetechnique.id? fichetechnique.id : 0;
    this.fichetechnique = fichetechnique;
    const dat = {
      groupeId: this.fichetechnique.groupeanalytiqueId,
      type: 'A'
    }
    forkJoin({
      familles: this.familleService.getFamilleByGroupe(dat),
      exploitations: this.exploitationService.getExploitation()
    }).subscribe({
      next: (data) => {
        const { familles, exploitations } = data;
        this.familles = familles;
        this.exploitations = exploitations;
        this.fichetechniqueService.getAllExploitationByFichetechnique(this.idFichetechnique).subscribe({
          next: (fichetechniqueExploitation: any) => {
            for (const e of this.exploitations) {
              const comparisonItem = fichetechniqueExploitation.find((i: any) => i.exploitationsId === e.id);
              if (comparisonItem != undefined) {
                e.selected = true;
              } else {
                e.selected = false;
              }
            }
          }
        })
      }
    })
  }

  submit() {
    if (this.idFichetechnique === 0) {
      this.fichetechniqueService.addFichetechnique(this.fichetechnique).subscribe({
        next: (fichetechnique: any) => {
          this.fichetechnique = fichetechnique;
          const exploitation: number[] = [];
          exploitation.push(3)
          for (const i of this.exploitations) {
            if (i.selected === true) {
              exploitation.push(i.id ? i.id : 0)
            }
          }
          this.fichetechniqueService.updateFichetechniqueExploitation(fichetechnique.id, exploitation).subscribe({
            next: () => {
              alert('Fichetechnique ajouter')
              this.modifToggle = !this.modifToggle;
            }
          })
        }
      })
    } else {
      this.fichetechniqueService.updateFichetechnique(this.idFichetechnique, this.fichetechnique).subscribe(() => {
        const exploitation: number[] = [];
        for (const i of this.exploitations) {
          if (i.selected === true) {
            exploitation.push(i.id? i.id : 0)
          }
        }
        this.fichetechniqueService.updateFichetechniqueExploitation(this.idFichetechnique, exploitation).subscribe(() => {
          this.fichetechniqueService.getFichetechniqueById(this.idFichetechnique).subscribe({
            next: (fichetechnique: InterfaceFichetechnique) => {
              this.fichetechnique = fichetechnique;
              this.fichetechniqueService.getAllExploitationByFichetechnique(this.idFichetechnique).subscribe({
                next: (fichetechniqueExploitation: any) => {
                  for (const item of this.exploitations) {
                    const comparisonItem = fichetechniqueExploitation.find((i: any) => i.exploitationsId === item.id);
                    if (comparisonItem != undefined) {
                      item.selected = true;
                    } else {
                      item.selected = false;
                    }
                  }
                  this.modifToggle = !this.modifToggle;
                  alert('Fichetechnique modifier')
                }
              })
            }
          })
        })
      })
    }
  }

  cancel() {

  }

  delete() {
    let exploitation: number[] = [];
    if (this.exploitation === 3) {
      for (const e of this.exploitations) {
        exploitation.push(e.id? e.id : 0)
      }
    } else {
      exploitation = [this.exploitation]
    }
    this.fichetechniqueService.desactiveFichetechnique(this.idFichetechnique, exploitation).subscribe({
      next: (data) => {
        alert('Fichetechnique supprimer');
        this.resetFichetechnique();
        this.initFichetechnique();
        this.toggle = !this.toggle;
      }
    });
  }

  deletes() {
    const selectedIds: number[] = [];
    let exploitation: number[] = [];
    for (const fichetechnique of this.fichetechniques) {
      if (fichetechnique.selected) {
        selectedIds.push(fichetechnique.id !== undefined ? fichetechnique.id : 0);
      }
    }
    if (this.exploitation === 3) {
      for (const e of this.exploitations) {
        exploitation.push(e.id? e.id : 0)
      }
    } else {
      exploitation = [this.exploitation]
    }
    if (selectedIds.length > 0) {
      const data = {
        fichetechniqueId: selectedIds,
        exploitationsId: exploitation
      }
      this.fichetechniqueService.desactiveFichetechniques(data).subscribe(() => {
        alert('Fichetechniques supprimer');
        this.initFichetechnique();
      })
    }
  }

  toggleModal() {
    this.toggle = !this.toggle;
    this.initFichetechnique();
  }

  modifToggleModal() {
    this.modifToggle = !this.modifToggle;
  }

  addToggleModal() {
    this.modifToggle = !this.modifToggle;
    this.toggle = (this.toggle === false ? true : false);
    this.idFichetechnique = 0;
    this.resetFichetechnique()
  }

  private resetFichetechnique() {
    forkJoin({
      unite: this.uniteService.getUnite(),
      categorie: this.categoriesService.getCategories(),
      groupeAnalytique: this.groupeService.getGroupeAnalytique(),
      famille: this.familleService.getFamilleByGroupe({ groupeId: 1, type: 'A' }),
    }).subscribe({
      next: (data) => {
        const { unite, categorie, groupeAnalytique, famille } = data;
        this.unites = unite;
        this.categories = categorie;
        this.groupeanalytiques = groupeAnalytique;
        this.familles = famille;
        this.fichetechnique = {
          libelle: '',
          categorieId: 0,
          familleId: 0,
          uniteId: 0,
          prix: 0,
          cout: 0,
          image: '',
          groupeanalytiqueId: 0,

          exploitation: [],
          categorie: categorie,
          famille: famille,
          unite: unite,
          groupeanalytique: groupeAnalytique,
        };
      },
      error: (error) => {
        console.error('Une erreur est survenue ', error);
      }
    });
  }

  selectUnite(unite: InterfaceUnite) {
    this.fichetechnique.uniteId = (unite.id? unite.id : 0);
    this.fichetechnique.unite = unite;
    console.log(this.fichetechnique.uniteId)
  }

  selectGroupeanalytique(groupeanalytique: InterfaceGroupeanalytiques) {
    this.fichetechnique.groupeanalytiqueId = (groupeanalytique.id? groupeanalytique.id : 0);
    this.fichetechnique.groupeanalytique = groupeanalytique;
    this.fichetechnique.famille.libelle = '';
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
    this.fichetechnique.familleId = (famille.id? famille.id : 0);
    this.fichetechnique.famille = famille;
  }

  selectCategorie(categorie: InterfaceCategories) {
    this.fichetechnique.categorieId = (categorie.id? categorie.id : 0);
    this.fichetechnique.categorie = categorie;
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        console.log(this.closeResult)
        if (this.closeResult == 'Closed with: Save click') {
          
        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        console.log(this.closeResult)
      },
    );
  }

}
