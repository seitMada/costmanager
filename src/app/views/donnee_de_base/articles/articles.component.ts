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

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDropdownModule],
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
    private allergeneService: AllergenesService
  ) { }

  private modalService = inject(NgbModal);
  closeResult = '';


  public toggle = true;
  public modifToggle = true;
  public exploitationToggle = true;
  public active_1 = 4;
  public active_2 = 1;
  public idArticle = 0;

  isError: boolean = false;

  toggleModal() {
    this.toggle = !this.toggle;
    this.initArticle();
  }

  modifToggleModal() {
    this.modifToggle = !this.modifToggle;
  }

  public article: InterfaceArticle;
  public articleOrigin: any;
  public articles: Article;
  public unites: any;
  public categories: any;
  public groupeAnalytique: any;
  public familles: any;
  public sousFamilles: any;
  public exploitations: any;
  public allergene: InterfaceAllergenes;
  public allergenes: any;

  public exploitation = +(sessionStorage.getItem('exploitation') || 3);

  ngOnInit(): void {
    this.resetArticle();
    this.initArticle();
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
        this.unites = unite;
        this.categories = categorie;
        this.allergenes = allergene;
        console.log(allergene)
        if (this.exploitation === 3) {
          this.exploitations = exploitation;
        } else {
          this.exploitations = exploitation.filter((item: any) => item.id === this.exploitation);
        }
      }
    })
  }

  showArticle(art: any) {
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
                    this.exploitations.forEach((e: any) => {
                      const comparisonItem = articleExploitation.find((i: any) => i.exploitationsId === e.id);
                      if (comparisonItem != undefined) {
                        e.selected = true;
                      }
                    });
                    this.allergenes.forEach((a: any) => {
                      const comparisonItem = this.article.allergeneArticle.find((i: any) => i.allergeneId === a.id);
                      console.log(comparisonItem)
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
      this.exploitationToggle = true;
      this.resetArticle();
    } else {
      this.articleService.getArticlesById(this.idArticle).subscribe({
        next: (article) => {
          this.article = article;
          this.modifToggle = !this.modifToggle;
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
      type: data.type
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
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
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

  addToggleModal() {
    this.modifToggle = !this.modifToggle;
    this.toggle = (this.toggle === false ? true : false);
    this.idArticle = 0;
    this.resetArticle()
  }

  showFournisseur(data: any) {
    console.log(data)
  }

  private resetArticle() {
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
          groupeanalytique: groupeAnalytique
        };
      },
      error: (error) => {
        console.error('Une erreur est survenue ', error);
      }
    });
  }

  submit() {
    if (this.idArticle === 0) {
      this.articleService.postArticle(this.article).subscribe((response) => {
        // alert(response)
        
      })
    } else {
      this.articleService.updateArticle(this.article).subscribe((response) => {
        alert('Article modifier')
        const exploitation: number[] = [];
        for (const i of this.exploitations) {
          exploitation.push(i.id)
        }
        forkJoin({
          deleteArticleExploitationByArticle: this.articleService.deleteArticleExploitationByArticle(this.idArticle, exploitation),
          article: this.articleService.getArticlesById(this.idArticle),
          articleExploitation: this.articleService.getArticleExploitationByArticle(this.idArticle),
        }).subscribe({
          next: (data) => {
            const { deleteArticleExploitationByArticle, article, articleExploitation } = data;
            this.article = article;
            for (const item of this.exploitations) {
              const comparisonItem = articleExploitation.find((i: any) => i.exploitationsId === item.id);
              if (comparisonItem != undefined) {
                item.selected = true;
              }
            }
            this.modifToggle = !this.modifToggle;
          }
        })
      })
    }
  }

  testEmpty() {

  }

  delete() {
    let exploitation: number[] = [];
    if (this.exploitation === 3) {
      for (const e of this.exploitations) {
        exploitation.push(e.id)
      }
    } else {
      exploitation = [this.exploitation]
    }
    this.articleService.desactiveArticle(this.idArticle, exploitation).subscribe({
      next: (data) => {
        alert('Article supprimer');
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
    if (this.exploitation === 3) {
      for (const e of this.exploitations) {
        exploitation.push(e.id)
      }
    } else {
      exploitation = [this.exploitation]
    }
    if (selectedIds.length > 0) {
      const data = {
        articleId: selectedIds,
        exploitationsId: exploitation
      }
      this.articleService.desactiveArticles(data).subscribe(() => {
        alert('Articles supprimer');
        this.initArticle();
      })
    }
  }
}
