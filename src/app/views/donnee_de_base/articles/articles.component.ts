import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ArticleService } from "../../../shared/service/article.service";
import { UnitesService } from "../../../shared/service/unites.service";
import { CategoriesService } from "../../../shared/service/categories.service";
import { GroupeAnalytiqueService } from "../../../shared/service/groupe-analytique.service";
import { FamillesService } from "../../../shared/service/familles.service";
import { SousfamillesService } from "../../../shared/service/sousfamilles.service";

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
    private sousFamilleService: SousfamillesService
  ) { }

  public toggle = true;
  public modifToggle = true;
  public active_1 = 4;
  public active_2 = 1;
  public idArticle = 0;

  toggleModal() {
    this.toggle = !this.toggle;
    this.initArticle();
  }

  modifToggleModal() {
    this.modifToggle = !this.modifToggle;
  }

  public article: any;
  public articleOrigin: any;
  public articles: any;
  public unites: any;
  public categories: any;
  public groupeAnalytique: any;
  public familles: any;
  public sousFamilles: any;

  ngOnInit(): void {
    this.initArticle();
  }

  initArticle() {
    this.articleService.getAllArticle().subscribe({
      next: (article) => {
        this.articles = article;
        console.log(this.articles)
        this.uniteService.getUnite().subscribe({
          next: (unite) => {
            this.unites = unite;
            this.categoriesService.getCategories().subscribe({
              next: (categorie) => {
                this.categories = categorie;
              },
            })
          }
        })
      }
    })
  }

  showArticle(art: any) {
    this.article = art;
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
              },
            })
          },
        })
      },
    })
  }

  cancel() {
    this.articleService.getArticlesById(this.idArticle).subscribe({
      next: (article) => {
        this.article = article;
        this.modifToggle = !this.modifToggle;
      },
    })
  }

  selectUnite(data: any) {
    this.article.unite = data;
  }

  selectCategorie(data: any) {
    this.article.categories = data;
  }

  selectGroupe(data: any) {
    this.article.groupeanalytique = data;
    const dat = {
      groupeId: data.id,
      type: data.type
    }
    this.familleService.getFamilleByGroupe(dat).subscribe({
      next: (famille) => {
        this.familles = famille;
        this.article.familles = [];
      },
    })
  }

  selectFamille(data: any) {
    this.article.familles = data;
    this.sousFamilleService.getSousFamilleByFamille(data.id).subscribe({
      next: (sousFamille) => {
        this.sousFamilles = sousFamille;
        this.article.sousFamille = [];
      },
    })
  }

  selectSousFamille(data: any) {
    this.article.sousfamilles = data;
  }

}
