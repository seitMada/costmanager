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

  private apiGetCommandeByFournisseurExploitation = environment.APIGETCOMMANDEBYFOURNISSEUREXPLOITATION;
  private apiCreateCommande = environment.APICREATECOMMANDE;
  private apiArticleExploitationByExploitationId = environment.APIGETARTICLEEXPLOITATIONBYEXPLOITATIONID;
  private apiGetCommandeDetailByCommandeId = environment.APIGETCOMMANDEDETAILBYCOMMANDEID;
  private apiArticleFournisseurByArticleId = environment.APIGETARTICLEFOURNISSEURBYARTICLEID;
  private apiDixDernierCommande = environment.APIGETDIXDERNIERCOMMANDE;
  private apiGetArticleFournisseurByArticle = environment.ARTICLEFOURNISSEURBYARTICLE;
  private apiCreateCommandeDetail = environment.APICREATECOMMANDEDETAIL;
  private apiDeleteCommande = environment.APIDELETECOMMANDE;

  public getCommandeByFournisseurExploitation(fournisseurId:number,exploitationId:number){
    return this.https.get<any>(this.apiGetCommandeByFournisseurExploitation+fournisseurId,{params : {exploitationId:exploitationId} });
  }

  public createBonCommande(commande:InterfaceBonCommandes,commandeDetails:InterfaceCommandeDetails[]){
    return this.https.post<any>(this.apiCreateCommande,{commande,commandeDetails});
  }

  public getArticleExploitaionByExploitationId(exploitationId:number){
    return this.https.get<any>(this.apiArticleExploitationByExploitationId+exploitationId);
  }

  public getArticleFournisseurByArticleId(fournisseurId:number,articleId:any[]) {
    return this.https.get<any>(this.apiArticleFournisseurByArticleId+fournisseurId,{ params: { articleId: articleId.join(',') } })
  }

  public getDixDernierCommandes(fournisseurId:number,exploitationId:number){
    return this.https.get<any>(this.apiDixDernierCommande+fournisseurId,{params: {exploitationId:exploitationId}});
  }

  public getArticleFournisseurByArticle(articleId:any[],fournisseurId:number,artExploitation:any[]){
    return this.https.get<any>(this.apiGetArticleFournisseurByArticle,{ params: { articleId: articleId.join(','),fournisseurId:fournisseurId,artExploitation:artExploitation.join(',') } });
  }


  public deleteOneCommande(commande:InterfaceBonCommandes){
    return this.https.post<any>(this.apiDeleteCommande,commande);
  }

  public getCommandeDetailByCommandeId(commandeId:number){
    return this.https.get<any>(this.apiGetCommandeDetailByCommandeId+commandeId);
  }

}
