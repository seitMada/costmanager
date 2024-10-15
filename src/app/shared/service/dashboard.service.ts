import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apivariationprixarticle = environment.APIVARIATIONARTICLE;
  private apiGetPpoByArticle = environment.APIGETPERTEARTICLE;
  private apiGetArticlePlusUtilise = environment.APIGETARTICLEPLUSUTILISE;
  private apiGetValorisationStock = environment.APIGETVALORISATIONSTOCK;
  private apiGetValueStockTheorique = environment.APIGETVALUESTOCKTHEORIQUE;
  private apiGetArticleInventaire = environment.APIGETARTICLEINVENTAIRE;

  constructor(private https: HttpClient) { }

  public getVariationArticle(idexploitation: number[], idarticle: number = 0) {
    return this.https.post(this.apivariationprixarticle, { id: idexploitation, idarticle: idarticle });
  }

  getPpoByArticle(articleId: number, operateurId: number) {
    return this.https.get<any>(this.apiGetPpoByArticle + articleId, { params: { operateurId: operateurId } });
  }

  public getArticlePlusUtilise(dateDebut: any, dateFin: any, exploitationId: number, articleid: number) {
    return this.https.post(this.apiGetArticlePlusUtilise, { dateDebut, dateFin, exploitationId, articleid });
  }

  public getValorisationStock(operateurId: number, exploitationId: number[]) {
    return this.https.get<any>(this.apiGetValorisationStock + operateurId, { params: { exploitationId: exploitationId } });
  }

  public getvaleurStockTheorique(dateInventaire: any, articleId: number) {
    return this.https.post<any>(this.apiGetValueStockTheorique, { dateInventaire, articleId });
  }

  public getstockArticle(articleId: number, operateurId: number) {
    return this.https.get<any>(this.apiGetArticleInventaire + articleId, { params: { operateurId: operateurId } });
  }

}
