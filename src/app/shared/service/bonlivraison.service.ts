import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InterfaceBonLivraisons } from '../model/interface-bonLivraison';
import { InterfaceLivraisonDetail } from '../model/interface-livraisondetail';
import { InterfaceBonCommande } from '../model/interface-bonCommande';

@Injectable({
  providedIn: 'root'
})
export class BonlivraisonService {

  constructor(private https:HttpClient) { }

  private apiCreateBonLivraison = environment.APICREATEBONLIVRAISON;
  private apiDeleteBonLivraison = environment.DELETEBONLIVRAISON;
  private apiValidateLivraison = environment.APIVALIDATELIVRAISON;
  private apiGetLivraisonByfournisseur = environment.APIGETLIVRAISONBYFOURNISSEUR;
  private apiGetArticleFournisseurByArticle = environment.ARTICLEFOURNISSEURBYARTICLE;
  private apiGetDetailCommandeByCommandeId = environment.APIGETCOMMANDEDETAILBYCOMMANDEID;
  private apiGetDetailLivraisonByLivraisonId = environment.APIGETDETAILLIVRAISONBYLIVRAISONID;
  private apiArticleFournisseurByArticleId = environment.APIGETARTICLEFOURNISSEURBYARTICLEID;
  private apiArticleExploitationByExploitationId = environment.APIGETARTICLEEXPLOITATIONBYEXPLOITATIONID;
  private apiGetCommandeByFournisseurExploitation = environment.APIGETCOMMANDEBYFOURNISSEUREXPLOITATIONVALIDATE;
  private apiGetArticleFournisseurById = environment.APIGETARTICLEFOURNISSEURBYID;
  private apiGetLivraison = environment.APIGETLIVRAISON;
  

  public getListLivraisonByFournisseurExploitation(fournisseurId:number,exploitationId:number){
    return this.https.get<any>(this.apiGetLivraisonByfournisseur+fournisseurId, {params : {exploitationId:exploitationId}});
  }

  public getListLivraisons(fournisseurId:number){
    return this.https.get<any>(this.apiGetLivraison+fournisseurId);
  }
  
  public getCommandeByFournisseurExploitationValidate(fournisseurId:number,exploitationId:number){
    return this.https.get<any>(this.apiGetCommandeByFournisseurExploitation+fournisseurId,{params : {exploitationId:exploitationId} });
  }

  public getListDetailCommandeByCommandeId(commandeId:number){
    return this.https.get<any>(this.apiGetDetailCommandeByCommandeId+commandeId);
  }

  public createNewBonLivraison(livraison:InterfaceBonLivraisons,livraisonDetail:InterfaceLivraisonDetail[],commande:InterfaceBonCommande){
    return this.https.post<any>(this.apiCreateBonLivraison,{livraison,livraisonDetail,commande});
  }

  public getDetailLivraisonByLivraisonId(livraisonId:number){
    return this.https.get<any>(this.apiGetDetailLivraisonByLivraisonId+livraisonId);
  }

  public deleteBonLivraison(livraison:InterfaceBonLivraisons){
    return this.https.post<any>(this.apiDeleteBonLivraison,livraison);
  }

  public getArticleExploitaionByExploitationId(exploitationId:number){
    return this.https.get<any>(this.apiArticleExploitationByExploitationId+exploitationId);
  }

  public getArticleFournisseurByArticleId(fournisseurId:number,articleId:any[]) {
    return this.https.get<any>(this.apiArticleFournisseurByArticleId+fournisseurId,{ params: { articleId: articleId.join(',') } })
  }

  public validateLivraison(livraison:InterfaceBonLivraisons){
    return this.https.post<any>(this.apiValidateLivraison,livraison)
  }

  public getArticleFournisseurByArticle(articleId:any[],fournisseurId:number,artExploitation:any[]){
    return this.https.get<any>(this.apiGetArticleFournisseurByArticle,{ params: { articleId: articleId.join(','),fournisseurId:fournisseurId,artExploitation:artExploitation.join(',') } });
  }

  public getArticleFournisseurById(artFournisseurArticleId:any[]){
    return this.https.get<any>(this.apiGetArticleFournisseurById,{ params: {artFournisseurArticleId: artFournisseurArticleId.join(',') }});
  }
}
