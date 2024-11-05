import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdownModule, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';

import { InterfaceArticle } from "../../../shared/model/interface-articles";
import { InterfaceAllergenes } from "../../../shared/model/interface-allergenes";

import { Article } from "../../../shared/model/articles";
import { Allergene } from "../../../shared/model/allergenes";

import { ArticleService } from "../../../shared/service/article.service";
import { UnitesService } from "../../../shared/service/unites.service";
import { CategoriesService } from "../../../shared/service/categories.service";
import { GroupeAnalytiqueService } from "../../../shared/service/groupe-analytique.service";
import { FamillesService } from "../../../shared/service/familles.service";
import { SousfamillesService } from "../../../shared/service/sousfamilles.service";
import { ExploitationService } from "../../../shared/service/exploitation.service";
import { AllergenesService } from "../../../shared/service/allergenes.service";
import { ZonestockagesService } from '../../../shared/service/zonestockages.service';
import { InterfaceLieustockages } from '../../../shared/model/interface-lieustockages';
import { InterfaceZonestockages } from '../../../shared/model/interface-zonestockages';
import { ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent } from '@coreui/angular';
import { SortFilterSearchService } from 'src/app/shared/service/sort-filter-search.service';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDropdownModule, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private articleService: ArticleService,
    private uniteService: UnitesService,
    private categoriesService: CategoriesService,
    private groupeService: GroupeAnalytiqueService,
    private familleService: FamillesService,
    private sousFamilleService: SousfamillesService,
    private exploitationService: ExploitationService,
    private allergeneService: AllergenesService,
    private zonestockageService: ZonestockagesService,
    private sortFilterSearchService: SortFilterSearchService
  ) { }

  private modalService = inject(NgbModal);
  closeResult = '';

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

  public toggle = true;
  public addToggle = true;
  public modifToggle = true;
  public exploitationToggle = true;
  public active_1 = 4;
  public active_2 = 1;
  public idArticle = 0;

  isError: boolean = false;

  toggleModal() {
    this.toggle = !this.toggle;
    this.addToggle = this.addToggle == false ? false : true;
    this.initArticle();
  }

  modifToggleModal() {
    this.modifToggle = !this.modifToggle;
    this.addToggle = !this.addToggle;
  }

  public article: InterfaceArticle;
  public articleOrigin: any;
  public articles: Article;
  public articlesBack: Article;
  public unites: any;
  public categories: any;
  public groupeAnalytique: any;
  public familles: any;
  public sousFamilles: any;
  public exploitations: any;
  public allergene: InterfaceAllergenes;
  public allergenes: any;
  public lieustockages: InterfaceLieustockages[];
  public lieustockage: InterfaceLieustockages;
  public zonestockages: InterfaceZonestockages[];
  public zonestockage: InterfaceZonestockages;

  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public exploitation = +(sessionStorage.getItem('exploitation') || 0);

  ngOnInit(): void {
    this.resetArticle();
    this.initArticle();
  }

  public truncateWord(word: string, maxLength = 15) {
    if (word.length > maxLength) {
      return word.slice(0, maxLength) + "...";
    }
    return word;
  }

  initArticle() {
    forkJoin({
      articleByExploitation: this.articleService.getArticlesByExploitation(this.exploitation),
      unite: this.uniteService.getUnite(),
      categorie: this.categoriesService.getCategories(),
      exploitation: this.exploitationService.getExploitation(),
      allergene: this.allergeneService.getAllAllergene()
    }).subscribe({
      next: (data) => {
        const { unite, categorie, articleByExploitation, exploitation, allergene } = data;
        this.articles = new Article(articleByExploitation);
        this.articlesBack = new Article(articleByExploitation);
        this.unites = unite;
        this.categories = categorie;
        this.allergenes = allergene;
        // console.log(this.isAdmin)
        if (this.isAdmin === true) {
          this.exploitations = exploitation.filter((item: any) => item.id !== this.exploitation);
        } else {
          this.exploitations = exploitation.filter((item: any) => item.id === this.exploitation);
        }
      }
    })
  }

  async showArticle(art: any) {
    this.article = art;
    console.log(this.article)
    this.idArticle = art.id;
    this.groupeService.getGroupeAnalytique().subscribe({
      next: (groupe_analytique) => {
        this.groupeAnalytique = groupe_analytique;
        const dat = {
          groupeId: this.article.groupeanalytiqueId,
          type: 'A'
        }
        this.familleService.getFamilleByGroupe(dat).subscribe({
          next: (famille) => {
            this.familles = famille;
            this.sousFamilleService.getSousFamilleByFamille(this.article.famillesId).subscribe({
              next: (sousFamille) => {
                this.sousFamilles = sousFamille;
                this.articleService.getArticleExploitationByArticle(this.idArticle).subscribe({
                  next: (articleExploitation) => {
                    const exploitationId: number[] = [0];
                    // this.exploitations = articleExploitation;
                    console.log(articleExploitation)
                    this.exploitations.forEach((e: any) => {
                      const comparisonItem = articleExploitation.find((i: any) => i.exploitationsId === e.id);
                      if (comparisonItem != undefined) {
                        e.selected = true;
                        exploitationId.push(e.id)
                      } else {
                        e.selected = false;
                      }
                    });
                    this.zonestockageService.getZoneStockageByExploitationId(exploitationId).subscribe({
                      next: (_data: any) => {
                        this.lieustockages = _data;
                        for (const _lieu of this.lieustockages) {
                          for (const _zone of _lieu.zonestockage) {
                            const select = this.article.articlezonestockages.filter(i => i.zonestockagesId === _zone.id)
                            if (select.length > 0) {
                              _zone.selected = true;
                            } else {
                              _zone.selected = false;
                            }
                          }
                        }
                      }
                    })
                    this.allergenes.forEach((a: any) => {
                      const comparisonItem = this.article.allergeneArticle.find((i: any) => i.allergeneId === a.id);
                      // console.log(comparisonItem)
                      if (comparisonItem != undefined) {
                        a.selected = true;
                      } else {
                        a.selected = false;
                      }
                    });
                  }
                })
              },
            })
          },
        })
      },
    })
  }

  cancel() {
    if (this.idArticle === 0) {
      this.toggle = true;
      this.modifToggle = true;
      this.addToggle = true;
      this.exploitationToggle = true;
      this.resetArticle();
    } else {
      this.articleService.getArticlesById(this.idArticle).subscribe({
        next: async (article) => {
          this.article = article;
          await this.showArticle(article);
          this.modifToggle = !this.modifToggle;
          this.addToggle = !this.addToggle;
        },
      })
    }
  }

  selectUnite(data: any) {
    this.article.unite = data;
    this.article.uniteId = data.id;
  }

  selectCategorie(data: any) {
    this.article.categories = data;
    this.article.categoriesId = data.id;
  }

  selectGroupe(data: any) {
    this.article.groupeanalytique = data;
    this.article.groupeanalytiqueId = data.id;
    const dat = {
      groupeId: data.id,
      type: 'A'
    }
    this.familleService.getFamilleByGroupe(dat).subscribe({
      next: (famille) => {
        this.familles = famille;
        this.sousFamilles = [];
      },
    })
  }

  selectFamille(data: any) {
    this.article.familles = data;
    this.article.famillesId = data.id;
    this.sousFamilleService.getSousFamilleByFamille(data.id).subscribe({
      next: (sousFamille) => {
        this.sousFamilles = sousFamille;
        // this.article.sousfamilles = [];
      },
    })
  }

  selectSousFamille(data: any) {
    this.article.sousfamilles = data;
    this.article.sousfamillesId = data.id;
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdropClass: 'light-dark-backdrop', centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        console.log(this.closeResult)
        if (this.closeResult == 'Closed with: Save click') {
          const allergene: number[] = [];
          for (const i of this.allergenes) {
            if (i.selected === true) {
              allergene.push(i.id)
            }
          }
          this.articleService.deleteAllergeneArticle(this.idArticle, allergene).subscribe(() => { });
        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        console.log(this.closeResult)
        this.allergeneService.getAllAllergene().subscribe({
          next: (allergenes) => {
            this.allergenes = allergenes;
            // this.modifToggle = !this.modifToggle;
            this.allergenes.forEach((a: any) => {
              const comparisonItem = this.article.allergeneArticle.find((i: any) => i.allergeneId === a.id);
              console.log(comparisonItem)
              if (comparisonItem != undefined) {
                a.selected = true;
              } else {
                a.selected = false;
              }
            });
          },
        })
      },
    );
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

  async addToggleModal() {
    this.modifToggle = !this.modifToggle;
    this.addToggle = !this.addToggle;
    this.toggle = (this.toggle === false ? true : false);
    this.idArticle = 0;
    await this.resetArticle()
    const exploitationId: number[] = [];
    exploitationId.push(this.isAdmin ? 0 : this.exploitation)
    this.zonestockageService.getZoneStockageByExploitationId(exploitationId).subscribe({
      next: (_data: any) => {
        this.lieustockages = _data;
        for (const _lieu of this.lieustockages) {
          for (const _zone of _lieu.zonestockage) {
            const select = this.article.articlezonestockages.filter(i => i.zonestockagesId === _zone.id);
            if (select.length > 0) {
              _zone.selected = true;
            } else {
              _zone.selected = false;
            }
          }
        }
      }
    })
  }

  showFournisseur(data: any) {
    console.log(data)
  }

  private async resetArticle() {
    forkJoin({
      unite: this.uniteService.getUnite(),
      categorie: this.categoriesService.getCategories(),
      groupeAnalytique: this.groupeService.getGroupeAnalytique(),
      famille: this.familleService.getFamilleByGroupe({ groupeId: 1, type: 'A' }),
      sousFamille: this.sousFamilleService.getSousFamilleByFamille(52)
    }).subscribe({
      next: (data) => {
        const { unite, categorie, groupeAnalytique, famille, sousFamille } = data;
        this.unites = unite;
        this.categories = categorie;
        this.groupeAnalytique = groupeAnalytique;
        this.familles = famille;
        this.sousFamilles = sousFamille;
        this.article = {
          codeArticle: '',
          libelle: '...',
          cout: 0,
          groupeanalytiqueId: 1,
          categoriesId: 1,
          famillesId: 1,
          sousfamillesId: 1,
          uniteId: 1,
          coefficientPonderation: 0,
          actif: false,
          allergeneArticle: [],
          articleexploitation: [],
          articlefournisseur: [],
          categories: categorie,
          familles: famille,
          sousfamilles: sousFamille,
          unite: unite,
          groupeanalytique: groupeAnalytique,
          articlezonestockages: []
        };
        this.lieustockages = []
      },
      error: (error) => {
        console.error('Une erreur est survenue ', error);
      }
    });
  }

  changeZonestockage() {
    console.log(this.exploitations);
    const exploitationId: number[] = [0];
    // exploitationId.push(this.exploitation)
    this.exploitations.forEach((e: any) => {
      if (e.selected === true) {
        e.selected = true;
        exploitationId.push(e.id)
      }
    });
    console.log(exploitationId);
    this.zonestockageService.getZoneStockageByExploitationId(exploitationId).subscribe({
      next: (_data: any) => {
        this.lieustockages = _data;
        for (const _lieu of this.lieustockages) {
          for (const _zone of _lieu.zonestockage) {
            const select = this.article.articlezonestockages.filter(i => i.zonestockagesId === _zone.id)
            if (select.length > 0) {
              _zone.selected = true;
            } else {
              _zone.selected = false;
            }
          }
        }
      }
    })
  }

  submit() {
    if (this.idArticle === 0) {
      this.articleService.createArticle(this.article).subscribe({
        next: (article: any) => {
          this.article = article;
          const exploitation: number[] = [];
          exploitation.push(this.exploitation)
          for (const i of this.exploitations) {
            if (i.selected === true) {
              exploitation.push(i.id)
            }
          }
          const zonestockage: number[] = [];
          // zonestockage.push(3)
          for (const _lieu of this.lieustockages) {
            for (const _zone of _lieu.zonestockage) {
              if (_zone.selected === true) {
                zonestockage.push(_zone.id || 0)
              }
            }
          }
          this.articleService.deleteArticleExploitationByArticle(article.id, exploitation).subscribe({
            next: () => {
              console.log(zonestockage)
              this.zonestockageService.deleteArticleZoneStockage(article.id, zonestockage).subscribe({
                next: async () => {
                  this.articleService.getArticlesById(article.id).subscribe({
                    next: async (_article) => {
                      this.article = _article;
                      await this.showArticle(_article);
                      this.toggleToast('Article ajouter');
                      this.modifToggle = !this.modifToggle;
                      this.addToggle = !this.addToggle;
                    }
                  })
                }
              })
            }
          })
        }
      })
    } else {
      this.articleService.updateArticle(this.article).subscribe((response) => {
        this.toggleToast('Article modifier')
        const exploitation: number[] = [];
        exploitation.push(this.exploitation);
        for (const i of this.exploitations) {
          if (i.selected === true) {
            exploitation.push(i.id)
          }
        }
        const zonestockage: number[] = [];
        // zonestockage.push(3)
        for (const _lieu of this.lieustockages) {
          for (const _zone of _lieu.zonestockage) {
            if (_zone.selected === true) {
              zonestockage.push(_zone.id || 0)
            }
          }
        }
        this.articleService.deleteArticleExploitationByArticle(this.idArticle, exploitation).subscribe({
          next: () => {
            this.zonestockageService.deleteArticleZoneStockage(this.idArticle, zonestockage).subscribe({
              next: () => {
                this.articleService.getArticleExploitationByArticle(this.idArticle).subscribe({
                  next: (_articleExploitation) => {
                    for (const item of this.exploitations) {
                      const comparisonItem = _articleExploitation.find((i: any) => i.exploitationsId === item.id);
                      if (comparisonItem != undefined) {
                        item.selected = true;
                      }
                    }
                    this.articleService.getArticlesById(this.idArticle).subscribe({
                      next: async (_article) => {
                        this.article = _article;
                        await this.showArticle(_article);
                        this.modifToggle = !this.modifToggle;
                        this.addToggle = !this.addToggle;
                      }
                    })
                  }
                })
              }
            })
          }
        })
      })
    }
  }

  testEmpty() {

  }

  delete() {
    let exploitation: number[] = [];
    if (this.isAdmin === true) {
      for (const e of this.exploitations) {
        exploitation.push(e.id)
      }
      exploitation.push(this.exploitation)
    } else {
      exploitation = [this.exploitation]
    }
    this.articleService.desactiveArticle(this.idArticle, exploitation).subscribe({
      next: (data) => {
        this.toggleToast('Article supprimer');
        this.resetArticle();
        this.initArticle();
        this.toggle = !this.toggle;
      }
    });
  }

  deletes() {
    const selectedIds: number[] = [];
    let exploitation: number[] = [];
    for (const article of this.articles) {
      if (article.selected) {
        selectedIds.push(article.id !== undefined ? article.id : 0);
      }
    }
    this.articlesBack = this.articles;
    if (this.isAdmin === true) {
      for (const e of this.exploitations) {
        exploitation.push(e.id)
      }
      exploitation.push(this.exploitation);
    } else {
      exploitation = [this.exploitation]
    }
    if (selectedIds.length > 0) {
      const data = {
        articleId: selectedIds,
        exploitationsId: exploitation
      }
      this.articleService.desactiveArticles(data).subscribe(() => {
        this.toggleToast('Articles supprimer');
        this.initArticle();
      })
    }
  }

  onSortArticles(event: any, colonne: any, type: string = 'string') {
    return this.sortFilterSearchService.handleSort(event, this.articles.articles as any, colonne, type, this.articlesBack.articles as any);
  }

  onSearchArticles(event: any, colonne: any) {
    this.articles.articles = (this.sortFilterSearchService.handleSearch(event, this.articles.articles as any, colonne, this.articlesBack.articles as any));
  }
}
