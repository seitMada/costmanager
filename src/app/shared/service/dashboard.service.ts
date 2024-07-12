import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apivariationprixarticle = environment.APIVARIATIONARTICLE;
  private apiGetPpoByArticle = environment.APIGETPERTEARTICLE;
  private apiGetValorisationArticleFt = environment.APIGETCOMPOSITIONFICHETECHNIQUE;

  constructor(private https: HttpClient) { }

  public getVariationArticle(idexploitation: number[], idarticle: number = 0) {
    return this.https.post(this.apivariationprixarticle, { id: idexploitation, idarticle: idarticle });
  }

  getPpoByArticle(articleId:number,operateurId:number){
    return this.https.get<any>(this.apiGetPpoByArticle+articleId,{params : {operateurId:operateurId}});
  }

  public getvalorisationArticleFT(){
    return this.https.get<any>(this.apiGetValorisationArticleFt);
  }

}
