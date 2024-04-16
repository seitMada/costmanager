import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InterfaceBonCommandes } from '../model/interface-bonCommande';
import { InterfaceCommandeDetails } from '../model/interface-commandedetail';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  constructor(private https:HttpClient) { }

  private apiGetTenCommande = environment.APIGETTENCOMMANDE;
  private apiCreateCommande = environment.APICREATECOMMANDE;
  private apiArticleExploitationByExploitationId = environment.APIGETARTICLEEXPLOITATIONBYEXPLOITATIONID;
  private apiArticleFournisseurByArticleId = environment.APIGETARTICLEFOURNISSEURBYARTICLEID;
  private apiDixDernierCommande = environment.APIGETDIXDERNIERCOMMANDE;
  private apiGetArticleFournisseurByArticle = environment.ARTICLEFOURNISSEURCHECKED;
  private apiCreateCommandeDetail = environment.APICREATECOMMANDEDETAIL;

  public getTenRecordsCommande(fournisseurId:number,exploitationId:number){
    return this.https.get<any>(this.apiGetTenCommande+fournisseurId,{params : {exploitationId:exploitationId} });
  }

  public createBonCommande(commande:InterfaceBonCommandes){
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

  public createCommandeDetail(commandeId:number,commandeDetails:InterfaceCommandeDetails[]){
    return this.https.post<any>(this.apiCreateCommandeDetail,{commandeId,commandeDetails});
  }

}
