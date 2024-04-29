import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbNavModule, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { FichetechniqueService } from "../../../shared/service/fichetechnique.service";
import { ActivatedRoute, Router } from '@angular/router';

import { InterfaceFichetechnique } from "../../../shared/model/interface-fichetechnique";
import { Composition, Compositions, Fichetechnique } from "../../../shared/model/fichetechniques";
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
import { InterfaceCategories } from '../../../shared/model/interface-categories';
import { ExploitationService } from '../../../shared/service/exploitation.service';
import { Exploitations } from "../../../shared/model/exploitations";
import { Article } from '../../../shared/model/articles';
import { ArticleService } from '../../../shared/service/article.service';
import { InterfaceComposition } from '../../../shared/model/interface-compositions';
import { InterfaceArticle } from '../../../shared/model/interface-articles';
import { TooltipModule } from '@coreui/angular';
import { ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent } from '@coreui/angular';

@Component({
  selector: 'app-fiche-technique',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDropdownModule, BsDatepickerModule, TooltipModule, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent],
  templateUrl: './fiche-technique.component.html',
  styleUrl: './fiche-technique.component.scss'
})
export class FicheTechniqueComponent implements OnInit {

  position = 'top-end';
  visible = false;
  percentage = 0;
  public message = '';
  public color = 'success';
  public textcolor = 'text-light';

  toggleToast(_message: string) {
    this.message = _message;
    this.visible = !this.visible;
  }

  onVisibleChange($event: boolean) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange($event: number) {
    this.percentage = $event * 25;
  }

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
  public addToggle = true;
  public deleteToggle = true;
  public modifToggle = true;
  public exploitationToggle = true;
  

  public articles: InterfaceArticle[];
  public fichetechniques: InterfaceFichetechnique[];
  public fichetechnique: InterfaceFichetechnique;
  public familles: Familles;
  public categories: Categories;
  public unites: Unites;
  public groupeanalytiques: Groupeanalytiques;
  public exploitations: Exploitations;
  public cout = {
    fichetechnique: 0,
    emballage: 0,
    alimentaire: 0
  }
  public compositions: InterfaceComposition[];
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

  public active = 1;
  private today = new Date();

  public dates = {
    debut: new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate()),
    fin: this.today
  }

  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public exploitation = +(sessionStorage.getItem('exploitation') || 3);

  private modalService = inject(NgbModal);
  closeResult = '';
  activeComposition = 1;

  ngOnInit(): void {
    this.resetFichetechnique();
    this.initFichetechnique();
  }

  public truncateWord(word: string, maxLength = 15) {
    if (word.length > maxLength) {
      return word.slice(0, maxLength) + "...";
    }
    return word;
  }

  async initFichetechnique() {
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
        if (this.isAdmin === true) {
          this.exploitations = exploitations.filter((item: any) => item.id !== this.exploitation);
        } else {
          this.exploitations = exploitations.filter((item: any) => item.id === this.exploitation);
        }
        this.articles = articlesByExploitation;
      }
    })
  }

  show(fichetechnique: InterfaceFichetechnique) {
    this.idFichetechnique = fichetechnique.id ? fichetechnique.id : 0;
    this.fichetechnique = fichetechnique;
    this.compositions = fichetechnique.composition;
    // console.log(this.compositions)
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
        for (const composition of this.compositions) {
          this.articles = this.articles.filter(row => row.id !== composition.articleId);
          this.fichetechniques = this.fichetechniques.filter(row => row.id !== composition.ftId);
        }
        this.calculCout(this.compositions);
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
          exploitation.push(this.exploitation)
          for (const i of this.exploitations) {
            if (i.selected === true) {
              exploitation.push(i.id ? i.id : 0)
            }
          }
          this.idFichetechnique = fichetechnique.id;
          this.fichetechniqueService.updateFichetechniqueExploitation(fichetechnique.id, exploitation).subscribe({
            next: () => {
              this.compositions = [];
                this.fichetechniqueService.getFichetechniqueById(fichetechnique.id).subscribe({
                  next: (fichetechnique) => {
                    this.toggleToast('Fichetechnique ajouter')
                    this.modifToggle = !this.modifToggle;
                    this.compositions = fichetechnique.composition;
                  }
                });
            }
          })
        }
      })
    } else {
      this.fichetechniqueService.updateFichetechnique(this.idFichetechnique, this.fichetechnique).subscribe(() => {
        const exploitation: number[] = [];
        exploitation.push(this.exploitation)
        for (const i of this.exploitations) {
          if (i.selected === true) {
            exploitation.push(i.id ? i.id : 0)
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
                  this.toggleToast('Fichetechnique modifier')
                }
              })
            }
          })
        })
      })
    }
  }

  cancel() {
    if (this.idFichetechnique === 0) {
      this.toggle = true;
      this.modifToggle = true;
      this.exploitationToggle = true;
      this.resetFichetechnique();
    } else {
      this.fichetechniqueService.getFichetechniqueById(this.idFichetechnique).subscribe({
        next: (fiches) => {
          this.fichetechnique = fiches;
          this.modifToggle = !this.modifToggle;
        },
      })
    }
  }

  delete() {
    let exploitation: number[] = [];
    if (this.isAdmin === true) {
      for (const e of this.exploitations) {
        exploitation.push(e.id ? e.id : 0)
      }
    } else {
      exploitation = [this.exploitation]
    }
    this.fichetechniqueService.desactiveFichetechnique(this.idFichetechnique, exploitation).subscribe({
      next: (data) => {
        this.toggleToast('Fichetechnique supprimer');
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
    if (this.isAdmin === true) {
      for (const e of this.exploitations) {
        exploitation.push(e.id ? e.id : 0)
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
        this.toggleToast('Fichetechniques supprimer');
        this.initFichetechnique();
      })
    }
  }

  toggleModal() {
    this.toggle = !this.toggle;
    this.addToggle = !this.addToggle;
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
          composition: [],
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
    this.fichetechnique.uniteId = (unite.id ? unite.id : 0);
    this.fichetechnique.unite = unite;
    console.log(this.fichetechnique.uniteId)
  }

  selectGroupeanalytique(groupeanalytique: InterfaceGroupeanalytiques) {
    this.fichetechnique.groupeanalytiqueId = (groupeanalytique.id ? groupeanalytique.id : 0);
    this.fichetechnique.groupeanalytique = groupeanalytique;
    this.fichetechnique.famille.libelle = '';
    const data = {
      groupeId: groupeanalytique.id,
      type: 'FT'
    }
    this.familleService.getFamilleByGroupe(data).subscribe({
      next: (famille) => {
        this.familles = famille;
      },
    })
  }

  selectFamille(famille: InterfaceFamilles) {
    this.fichetechnique.familleId = (famille.id ? famille.id : 0);
    this.fichetechnique.famille = famille;
  }

  selectCategorie(categorie: InterfaceCategories) {
    this.fichetechnique.categorieId = (categorie.id ? categorie.id : 0);
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
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdropClass: 'light-dark-backdrop', centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        // console.log(this.closeResult)
        if (this.closeResult == 'Closed with: Save click') {
          this.fichetechniqueService.updateComposition(this.idFichetechnique, this.compositions).subscribe(async () => {
            await this.calculCout(this.compositions);
            this.fichetechniqueService.updateFichetechnique(this.idFichetechnique, this.fichetechnique).subscribe({
              next: () => {
                this.compositions = [];
                this.fichetechniqueService.getFichetechniqueById(this.idFichetechnique).subscribe({
                  next: (fichetechnique) => {
                    this.toggleToast('Composition du fichetechnique mis à jour');
                    this.compositions = fichetechnique.composition;
                  }
                });
              }
            })
          });
        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        console.log(this.closeResult)
        this.compositions = [];
        this.fichetechniqueService.getFichetechniqueById(this.idFichetechnique).subscribe({
          next: async (fichetechnique) => {
            await this.initFichetechnique()
            this.compositions = fichetechnique.composition;
          }
        });
      },
    );
  }

  changeCompositionArticle(article: InterfaceArticle) {
    const composition: InterfaceComposition = {
      fichetechniqueId: this.idFichetechnique,
      articleId: article.id ? article.id : 0,
      ftId: null,
      quantite: 0,
      uniteId: article.uniteId,
      cout: article.cout + (article.cout * ( article.coefficientPonderation / 100 )),

      article: article,
      fichetechniqueCompositon: null,
      unite: article.unite,
    };
    this.compositions.push(composition);
    for (const composition of this.compositions) {
      this.articles = this.articles.filter(row => row.id !== composition.articleId);
    }
  }

  changeCompositionFichetechnique(fichetechnique: InterfaceFichetechnique) {
    const composition: InterfaceComposition = {
      fichetechniqueId: this.idFichetechnique,
      articleId: null,
      ftId: fichetechnique.id ? fichetechnique.id : 0,
      quantite: 0,
      uniteId: fichetechnique.uniteId,
      cout: fichetechnique.cout,

      article: null,
      fichetechniqueCompositon: fichetechnique,
      unite: fichetechnique.unite,
    };
    this.compositions.push(composition);
    for (const composition of this.compositions) {
      this.fichetechniques = this.fichetechniques.filter(row => row.id !== composition.ftId);
    }
  }

  deleteComposition(line: any) {
    if (line.article !== null) {
      this.compositions = this.compositions.filter(row => row.articleId !== line.articleId);
      this.articleService.getArticlesByExploitation(this.exploitation).subscribe({
        next: (article) => {
          this.articles = article;
          for (const composition of this.compositions) {
            this.articles = this.articles.filter(row => row.id !== composition.articleId);
          }
        }
      })
    } else {
      this.compositions = this.compositions.filter(row => row.ftId !== line.ftId);
      this.fichetechniqueService.getFichetechniqueByExploitation(this.exploitation).subscribe({
        next: (fichetechnique) => {
          this.fichetechniques = fichetechnique;
          for (const composition of this.compositions) {
            this.fichetechniques = this.fichetechniques.filter(row => row.id !== composition.ftId);
          }
        }
      })
    }
  }

  async calculCout(composition: InterfaceComposition[]) {
    console.log(composition)
    let coutAlimentaire = 0;
    let coutEmballage = 0;
    for (const item of composition) {
      if (item.articleId != null) {
        if (item.article?.groupeanalytiqueId === 1 || item.article?.groupeanalytiqueId === 4) {
          coutAlimentaire += item.cout * item.quantite;
        } else {
          coutEmballage += item.cout * item.quantite;
        }
      } else {
        if (item.fichetechniqueCompositon?.groupeanalytiqueId === 1 || item.fichetechniqueCompositon?.groupeanalytiqueId === 4) {
          coutAlimentaire += item.cout * item.quantite;
        } else {
          coutEmballage += item.cout * item.quantite;
        }
      }
    }
    this.cout.alimentaire = coutAlimentaire;
    this.cout.emballage = coutEmballage;
    this.cout.fichetechnique = coutAlimentaire + coutEmballage;
    this.fichetechnique.cout = this.cout.fichetechnique;
  }
}
