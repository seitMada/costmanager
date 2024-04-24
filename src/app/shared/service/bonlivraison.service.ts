import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BonlivraisonService {

  constructor(private https:HttpClient) { }

  private apiGetLivraisonByfournisseur = environment.APIGETLIVRAISONBYFOURNISSEUR;
  private apiArticleExploitationByExploitationId = environment.APIGETARTICLEEXPLOITATIONBYEXPLOITATIONID;
  private apiArticleFournisseurByArticleId = environment.APIGETARTICLEFOURNISSEURBYARTICLEID;

  public getListLivraisonByFournisseurExploitation(fournisseurId:number,exploitationId:number){
    return this.https.get<any>(this.apiGetLivraisonByfournisseur+fournisseurId, {params : {exploitationId:exploitationId}});
  }

  public getArticleExploitaionByExploitationId(exploitationId:number){
    return this.https.get<any>(this.apiArticleExploitationByExploitationId+exploitationId);
  }

  public getArticleFournisseurByArticleId(fournisseurId:number,articleId:any[]) {
    return this.https.get<any>(this.apiArticleFournisseurByArticleId+fournisseurId,{ params: { articleId: articleId.join(',') } })
  }

  public getListArticleInCommandeValidate(fournisseurId:number,exploitationId:number){

  }
}
