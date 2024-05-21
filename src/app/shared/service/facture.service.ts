import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InterfaceAchat } from '../model/interface-achats';
import { InterfaceAchatDetail } from '../model/interface-achatdetail';
import { InterfaceBonLivraisons } from '../model/interface-bonLivraison';

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  constructor(private https:HttpClient) { }

  private apiCreateFacture = environment.APICREATEFACTURE;
  private apiValidateFacture = environment.APIVALIDATEFACTURE;
  private apiGetFactureByfournisseur = environment.APIGETFACTUREBYFOURNISSEUR;
  private apiGetArticleFournisseurByArticle = environment.ARTICLEFOURNISSEURBYARTICLE;
  private apiGetFactureByFournisseurExploitation = environment.APIGETFACTUREBYFOURNISSEUREXPLOITATION;
  private apiGetLivraisonByFournisseurExploitationValidate = environment.APIGETLIVRAISONBYFOURNISSEUREXPLOITATIONVALIDATE;
  private apiGetDetailLivraisonByLivraisonId =  environment.APIGETDETAILLIVRAISONBYLIVRAISONID;
 
  public getFactureByFournisseurExploitation(fournisseurId:number,exploitationId:number){
    return this.https.get<any>(this.apiGetFactureByFournisseurExploitation+fournisseurId, { params: { exploitationId: exploitationId } });
  }

  public createFacture(facture:InterfaceAchat,detailFactures:InterfaceAchatDetail[],livraison:InterfaceBonLivraisons){
    return this.https.post<any>(this.apiCreateFacture,{facture,detailFactures,livraison});
  }

  public getLivraisonByFournisseurExploitationValidate(fournisseurId:number,exploitationId:number){
    return this.https.get<any>(this.apiGetLivraisonByFournisseurExploitationValidate+fournisseurId, { params: { exploitationId : exploitationId} })
  }

  public getListDetailLivraisonByLivraisonId(livraisonId:number){
    return this.https.get<any>(this.apiGetDetailLivraisonByLivraisonId+livraisonId);
  }

  public getListFactureByFournisseurExploitation(fournisseurId:number,exploitationId:number){
    return this.https.get<any>(this.apiGetFactureByfournisseur+fournisseurId, {params : {exploitationId:exploitationId}});
  }

  public validateFacture(facture:InterfaceAchat){
    return this.https.post<any>(this.apiValidateFacture,facture)
  }

  public getArticleFournisseurByArticle(articleId:any[],fournisseurId:number,artExploitation:any[]){
    return this.https.get<any>(this.apiGetArticleFournisseurByArticle,{ params: { articleId: articleId.join(','),fournisseurId:fournisseurId,artExploitation:artExploitation.join(',') } });
  }
}
