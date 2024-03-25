import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdownModule, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';

import { InterfaceArticles, InterfaceArticle } from "../../../shared/model/interface-articles";
import { Article } from "../../../shared/model/articles";
import { ArticleService } from "../../../shared/service/article.service";

import { InterfaceUnite } from "../../../shared/model/interface-unite";
import { Unite } from "../../../shared/model/unite";
import { UnitesService } from "../../../shared/service/unites.service";

import { InterfaceCategories } from "../../../shared/model/interface-categories";
import { Categorie } from "../../../shared/model/categories";
import { CategoriesService } from "../../../shared/service/categories.service";

import { InterfaceGroupeanalytiques } from "../../../shared/model/interface-groupeanalytiques";
import { Groupeanalytique } from "../../../shared/model/groupeanalytiques";
import { GroupeAnalytiqueService } from "../../../shared/service/groupe-analytique.service";

import { InterfaceFamilles } from "../../../shared/model/interface-familles";
import { Famille } from "../../../shared/model/familles";
import { FamillesService } from "../../../shared/service/familles.service";

import { InterfaceSousfamilles } from "../../../shared/model/interface-sousfamilles";
import { SousFamille } from "../../../shared/model/sousfamilles";
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

  private modalService = inject(NgbModal);
  closeResult = '';


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

  public article: InterfaceArticle;
  public articleOrigin: any;
  public articles: Article;
  public unites: any;
  public categories: any;
  public groupeAnalytique: any;
  public familles: any;
  public sousFamilles: any;

  private exploitation = +(sessionStorage.getItem('exploitation') || 3);

  ngOnInit(): void {
    this.initArticle();
  }

  initArticle() {
    forkJoin({
      articleByExploitation: this.articleService.getArticlesByExploitation(this.exploitation),
      unite: this.uniteService.getUnite(),
      categorie: this.categoriesService.getCategories(),
    }).subscribe({
      next: (data) => {
        const { unite, categorie, articleByExploitation } = data;
        this.articles = new Article(articleByExploitation);
        this.unites = unite;
        this.categories = categorie;
        this.resetArticle();
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
        // this.article.familles = [];
      },
    })
  }

  selectFamille(data: any) {
    this.article.familles = data;
    this.sousFamilleService.getSousFamilleByFamille(data.id).subscribe({
      next: (sousFamille) => {
        this.sousFamilles = sousFamille;
        // this.article.sousfamilles = [];
      },
    })
  }

  selectSousFamille(data: any) {
    this.article.sousfamilles = data;
  }




  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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
          libelle: '',
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
}
