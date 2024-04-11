import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  constructor(private https:HttpClient) { }

  private apiGetCommande = environment.APIGETCOMMANDE;
  private apiCreateCommande = environment.APICREATECOMMANDE;
  private apiArticleExploitationByExploitationId = environment.APIGETARTICLEEXPLOITATIONBYEXPLOITATIONID;
  private apiArticleFournisseurByArticleId = environment.APIGETARTICLEFOURNISSEURBYARTICLEID;
  private apiDixDernierCommande = environment.APIGETDIXDERNIERCOMMANDE;
  private apiGetArticleFournisseurByArticle = environment.ARTICLEFOURNISSEURCHECKED;

  public getAllCommande(){
    return this.https.get<any>(this.apiGetCommande);
  }

  public createBonCommande(commande:any){
    return this.https.post<any>(this.apiCreateCommande,commande);
  }

  public getArticleExploitaionByExploitationId(exploitationId:number){
    return this.https.get<any>(this.apiArticleExploitationByExploitationId+exploitationId);
  }

  public getArticleFournisseurByArticleId(fournisseurId:number,articleId:any[]) {
    return this.https.get<any>(this.apiArticleFournisseurByArticleId+fournisseurId,{ params: { articleId: articleId.join(',') } })
  }

  public getDixDernierCommandes(fournisseurId:number){
    return this.https.get<any>(this.apiDixDernierCommande+fournisseurId);
  }

  public getArticleFournisseurByArticle(articleId:any[]){
    return this.https.get<any>(this.apiGetArticleFournisseurByArticle,{ params: { articleId: articleId.join(',')} });
  }

}
