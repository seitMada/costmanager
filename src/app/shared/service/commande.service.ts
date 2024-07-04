import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InterfaceBonCommande, InterfaceBonCommandes } from '../model/interface-bonCommande';
import { InterfaceCommandeDetail, InterfaceCommandeDetails } from '../model/interface-commandedetail';

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
  private apiDeleteCommande = environment.APIDELETECOMMANDE;
  private apiValidateCommande = environment.APIVALIDATECOMMANDE;
  private apiGetListCommande = environment.APIGETCOMMANDE;

  public getCommandeByFournisseurExploitation(fournisseurId:number,exploitationId:number){
    return this.https.get<any>(this.apiGetCommandeByFournisseurExploitation+fournisseurId,{params : {exploitationId:exploitationId} });
  }

  public getAllCommande(fournisseurId:number){
    return this.https.get<any>(this.apiGetListCommande+fournisseurId);
  }

  public createBonCommande(commande:InterfaceBonCommande,commandeDetails:InterfaceCommandeDetail[]){
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


  public deleteOneCommande(commande:InterfaceBonCommande){
    return this.https.post<any>(this.apiDeleteCommande,commande);
  }

  public getCommandeDetailByCommandeId(commandeId:number){
    return this.https.get<any>(this.apiGetCommandeDetailByCommandeId+commandeId);
  }

  public validateCommande(commande:InterfaceBonCommande){
    return this.https.post<any>(this.apiValidateCommande,commande);
  }

}