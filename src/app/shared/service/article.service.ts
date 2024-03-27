import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InterfaceArticle } from '../model/interface-articles';

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

  constructor(private https: HttpClient){}

  public getAllArticle(){
    return this.https.get<any>(this.apiGetArticle)
  }

  public getArticlesById(id: number){
    return this.https.get<any>(this.apiGetArticleById + id)
  }

  public getArticlesByExploitation(id: number){
    return this.https.get<any>(this.apiGetArticleByExploitation + id)
  }

  public postArticle(article: InterfaceArticle){
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
}
