import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InterfaceArticle } from '../model/interface-articles';
import { forkJoin, retry } from 'rxjs';
import { CategoriesService } from './categories.service';
import { FamillesService } from './familles.service';
import { GroupeAnalytiqueService } from './groupe-analytique.service';
import { SousfamillesService } from './sousfamilles.service';
import { UnitesService } from './unites.service';
import { InterfaceCategories } from '../model/interface-categories';
import { InterfaceFamilles } from '../model/interface-familles';
import { InterfaceSousfamilles } from '../model/interface-sousfamilles';
import { InterfaceUnite } from '../model/interface-unite';
import { InterfaceGroupeanalytiques } from '../model/interface-groupeanalytiques';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiGetArticle = environment.APIGETARTICLE;
  private apiGetArticleById = environment.APIGETARTICLEBYID;
  private apiGetArticleByExploitation = environment.APIGETARTICLEBYEXPLOITATION;
  private apiCreateArticle = environment.APIPOSTCREATEARTICLE;
  private apiUpdateArticle = environment.APIPOSTUPDATEARTICLE;
  private apiDeleteArticle = environment.APIPOSTDELETEARTICLE;
  private apiDeleteArticles = environment.APIPOSTDELETEARTICLES;
  private apiGetArticleExploitationByArticle = environment.APIGETEXPLOITATIONBYARTICLE;
  private apiPostDeleteArticleExploitationByArticle = environment.APIPOSTDELETEARTICLEEXPLOITATIONBYARTICLE;
  private apiPostDeleteAllergeneArticle = environment.APIPOSTDELETEALLERGENEARTICLE;
  private apiPostDesactiveArticle = environment.APIPOSTDESACTIVEARTICLE;
  private apiPostDesactiveArticles = environment.APIPOSTDESACTIVEARTICLES;
  private apiGetArticleExclude = environment.APIGETARTICLEEXCLUDE;
  private apiGetArticleByZone = environment.APIGETARTICLEBYZONE;

  private apiGetArticleByFournisseur = environment.APIGETARTICLEBYFOURNISSEUR;
  private apiGetArticleByIdFournisseur = environment.APIGETARTICLEBYFOURNISSEUR;

  constructor(private https: HttpClient) { }

  public getAllArticle() {
    return this.https.get<any>(this.apiGetArticle)
  }

  public getArticlesById(id: number) {
    return this.https.get<any>(this.apiGetArticleById + id)
  }

  public getArticlesByExploitation(id: number) {
    return this.https.get<any>(this.apiGetArticleByExploitation + id)
  }

  public createArticle(article: InterfaceArticle) {
    return this.https.post(this.apiCreateArticle, article);
  }

  public updateArticle(article: InterfaceArticle) {
    return this.https.patch(this.apiUpdateArticle + article.id, article);
  }

  public deleteArticle(article: InterfaceArticle) {
    return this.https.post(this.apiDeleteArticle, article);
  }

  public deleteArticles(id: number[]) {
    return this.https.post(this.apiDeleteArticles, id);
  }

  public getArticleExploitationByArticle(id: number) {
    return this.https.get<any>(this.apiGetArticleExploitationByArticle + id);
  }

  public deleteArticleExploitationByArticle(articleId: number, exploitationid: number[]) {
    return this.https.post(this.apiPostDeleteArticleExploitationByArticle + articleId, exploitationid);
  }

  public deleteAllergeneArticle(articleId: number, allergeneId: number[]) {
    return this.https.post(this.apiPostDeleteAllergeneArticle + articleId, allergeneId);
  }

  public desactiveArticle(articleId: number, exploitationid: number[]) {
    return this.https.post(this.apiPostDesactiveArticle + articleId, exploitationid);
  }

  public desactiveArticles(data: any) {
    return this.https.post(this.apiPostDesactiveArticles, data);
  }

  public getArticlesByFournisseur(id: number) {
    return this.https.get<any>(this.apiGetArticleByFournisseur + id);
  }

  public getArticlesExclude(id: number, articleId: number[]) {
    return this.https.post(this.apiGetArticleExclude, { id: id, article: articleId });
  }

  public getArticlesByZone(zonestockageId: number[]) {
    return this.https.post(this.apiGetArticleByZone, { zonestockageId: zonestockageId });
  }

  public resetArticle() {
    const categorie: InterfaceCategories = {
      code: '',
      libelle: '',
      actif: false
    }
    const famille: InterfaceFamilles = {
      libelle: '',
      code_couleur: '',
      groupeId: 0,
      actif: false,
      type: ''
    }
    const sousFamille: InterfaceSousfamilles = {
      code: '',
      libelle: '',
      famillesId: 0
    }
    const unite: InterfaceUnite = {
      libelle: '',
      code: '',
      abreviation: '',
      step: 0,
      actif: false
    }
    const groupeAnalytique: InterfaceGroupeanalytiques = {
      code_groupe: '',
      groupe: '',
      actif: false,
      type: ''
    }

    const article: InterfaceArticle = {
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
    return article;
  }
}
