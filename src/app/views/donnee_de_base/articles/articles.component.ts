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
    private familleService: FamillesService
  ) { }

  public toggle = true;
  public modifToggle = true;
  public active_1 = 2;
  public active_2 = 1;

  toggleModal() {
    this.toggle = !this.toggle;
  }

  modifToggleModal() {
    this.modifToggle = !this.modifToggle;
  }

  public article: any;
  public articles: any;
  public unites: any;
  public categories: any;
  public groupeAnalytique: any;
  public familles: any;

  ngOnInit(): void {
    this.articleService.getAllArticle().subscribe({
      next: (article) => {
        this.articles = article;
        this.uniteService.getUnite().subscribe({
          next: (unite) => {
            this.unites = unite;
            this.categoriesService.getCategories().subscribe({
              next: (categorie) => {
                this.categories = categorie;
                this.groupeService.getGroupeAnalytique().subscribe({
                  next: (groupe_analytique) => {
                    this.groupeAnalytique = groupe_analytique;
                    console.log(groupe_analytique)
                  },
                })
              },
            })
          }
        })
      },
      error: (error) => {
        alert('ERREUR')
      }
    })
  }

  showArticle(art: any) {
    this.article = art;
    console.log(this.article)
    this.toggleModal();
  }

  selectUnite(data: any) {
    this.article.unite = data;
  }

  selectCategorie(data: any) {
    this.article.categories = data;
  }

  selectGroupe(data: any) {
    this.article.groupeanalytique = data;
    console.log(data)
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
  }

}
