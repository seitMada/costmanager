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
import { SortFilterSearchService } from 'src/app/shared/service/sort-filter-search.service';

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

    private sortFilterSearchService: SortFilterSearchService
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
  public fichetechniquesBack: InterfaceFichetechnique[];
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

  public idFichetechnique: number = 0;

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
        this.fichetechniquesBack = fichetechniqueByExploitation;

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
        this.addToggle = false;
        this.familles = familles;
        this.exploitations = exploitations;

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

            const articleIds: (number | undefined)[] = [];
            const fichetechniqueIds: (number | undefined)[] = [];
            for (const composition of this.compositions) {
              if (composition.articleId != null) {
                articleIds.push(composition.articleId);
              }
              if (composition.ftId != null) {
                fichetechniqueIds.push(composition.ftId);
              }
            }
            fichetechniqueIds.push(fichetechnique.id)
            this.articles = this.articles.filter(row => !articleIds.includes(row.id) && row.articlefournisseur.length > 0);
            this.articles.forEach(_article => {
              _article.cout = _article.articlefournisseur.length ? _article.articlefournisseur[0].prixReference : 0;
            });
            this.fichetechniques = this.fichetechniques.filter(row => !fichetechniqueIds.includes(row.id));
            this.fichetechniques.forEach(_ft => {
              _ft.composition.forEach(_composition => {
                if (_composition.articleId !== null) {
                  _composition.article?.articlefournisseur.forEach(_artfournisseur => {
                    _composition.cout = _artfournisseur.prixReference;
                  });
                }
              });
            });
            this.fichetechniquesBack = this.fichetechniques.filter(row => !fichetechniqueIds.includes(row.id));
            this.fichetechniquesBack.forEach(_ft => {
              _ft.composition.forEach(_composition => {
                if (_composition.articleId !== null) {
                  _composition.article?.articlefournisseur.forEach(_artfournisseur => {
                    _composition.cout = _artfournisseur.prixReference;
                  });
                }
              });
            });
          }
        })
      }
    })
  }

  submit() {
    if (this.idFichetechnique === 0) {
      this.fichetechniqueService.addFichetechnique(this.fichetechnique).subscribe({
        next: (fichetechnique: any) => {

          const exploitation: number[] = [];
          if (this.isAdmin) {
            for (const i of this.exploitations) {
              if (i.selected === true) {
                exploitation.push(i.id ? i.id : 0)
              }
            }
          } else {
            exploitation.push(this.exploitation)





          }
          this.idFichetechnique = fichetechnique;
          this.fichetechniqueService.updateFichetechniqueExploitation(fichetechnique, this.fichetechnique.id || 0, exploitation).subscribe({
            next: () => {
              this.compositions = [];
              this.fichetechniqueService.getFichetechniqueById(fichetechnique).subscribe({
                next: (fichetechnique) => {

                  this.fichetechnique = fichetechnique;
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
        if (this.isAdmin) {
          for (const i of this.exploitations) {
            if (i.selected === true) {
              exploitation.push(i.id ? i.id : 0)
            }
          }
        } else {
          exploitation.push(this.exploitation)





        }
        if (this.isAdmin) {
          this.fichetechniqueService.updateFichetechniqueExploitation(this.idFichetechnique, this.idFichetechnique, exploitation).subscribe(() => {
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
        } else {
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
        }
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
      exploitation.push(this.exploitation);
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
      exploitation.push(this.exploitation);
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
    this.fichetechniquesBack = this.fichetechniques
  }

  toggleModal() {
    this.toggle = !this.toggle;
    this.addToggle = this.addToggle == false ? false : true;
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
        this.compositions = [];
        this.fichetechnique = {
          libelle: '',
          code: '',
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
        if (this.closeResult == 'Closed with: Save click') {
          let _cout = 0;
          for (const _composition of this.compositions) {
            _cout += _composition.cout;
          }
          this.fichetechnique.cout = _cout;
          this.fichetechniqueService.addFichetechnique(this.fichetechnique).subscribe({
            next: (idfichetechnique: any) => {
              this.idFichetechnique = idfichetechnique;
              const exploitation: number[] = [];
              if (this.isAdmin) {
                for (const i of this.exploitations) {
                  if (i.selected === true) {
                    exploitation.push(i.id ? i.id : 0)
                  }
                }
              } else {
                exploitation.push(this.exploitation)
              }
              this.fichetechniqueService.updateFichetechniqueExploitation(idfichetechnique, this.fichetechnique.id || 0, exploitation).subscribe({
                next: () => {
                  this.fichetechniqueService.updateComposition(idfichetechnique, this.compositions).subscribe({
                    next: () => {
                      this.fichetechniqueService.getFichetechniqueById(idfichetechnique).subscribe({
                        next: async (fichetechnique: any) => {
                          await this.calculCout(this.compositions);
                          this.fichetechnique = fichetechnique;
                          this.toggleToast('Composition et fiche technique mis à jour')
                          this.compositions = fichetechnique.composition;
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

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
      // cout: article.cout + (article.cout * (article.coefficientPonderation / 100)),
      cout: article.articlefournisseur.reduce((max, item) => {
        const prixUniteFT = item.prixReference / ((item.conditionnement[0]?.coefficientAchatCommande * item.conditionnement[0]?.coefficientInventaireAchat * item.conditionnement[0]?.coefficientInventaire) || 1);

        return prixUniteFT > max ? prixUniteFT : max;
      }, 0),
      article: article,
      fichetechniqueCompositon: null,
      unite: article.unite,
    };
    console.log(composition)
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
    this.fichetechnique.cout = +this.cout.fichetechnique.toFixed(2);
  }

  onSortFicheTechniques(event: any, colonne: any, type: string = 'string') {
    return this.sortFilterSearchService.handleSort(event, this.fichetechniques, colonne, type, this.fichetechniquesBack);
  }

  onSearchFicheTechniques(event: any, colonne: any) {
    this.fichetechniques = (this.sortFilterSearchService.handleSearch(event, this.fichetechniques, colonne, this.fichetechniquesBack));
  }
}
