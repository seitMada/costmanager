import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InterfaceBonLivraisons } from '../model/interface-bonLivraison';
import { InterfaceLivraisonDetails } from '../model/interface-livraisondetail';
import { InterfaceBonCommandes } from '../model/interface-bonCommande';

@Injectable({
  providedIn: 'root'
})
export class BonlivraisonService {

  constructor(private https:HttpClient) { }

  private apiCreateBonLivraison = environment.APICREATEBONLIVRAISON;
  private apiDeleteBonLivraison = environment.DELETEBONLIVRAISON;
  private apiGetLivraisonByfournisseur = environment.APIGETLIVRAISONBYFOURNISSEUR;
  private apiGetDetailCommandeByCommandeId = environment.APIGETCOMMANDEDETAILBYCOMMANDEID;
  private apiGetDetailLivraisonByLivraisonId = environment.APIGETDETAILLIVRAISONBYLIVRAISONID;
  private apiGetCommandeByFournisseurExploitation = environment.APIGETCOMMANDEBYFOURNISSEUREXPLOITATIONVALIDATE;
  

  public getListLivraisonByFournisseurExploitation(fournisseurId:number,exploitationId:number){
    return this.https.get<any>(this.apiGetLivraisonByfournisseur+fournisseurId, {params : {exploitationId:exploitationId}});
  }
  
  public getCommandeByFournisseurExploitationValidate(fournisseurId:number,exploitationId:number){
    return this.https.get<any>(this.apiGetCommandeByFournisseurExploitation+fournisseurId,{params : {exploitationId:exploitationId} });
  }

  public getListDetailCommandeByCommandeId(commandeId:number){
    return this.https.get<any>(this.apiGetDetailCommandeByCommandeId+commandeId);
  }

  public createNewBonLivraison(livraison:InterfaceBonLivraisons,livraisonDetail:InterfaceLivraisonDetails[],commande:InterfaceBonCommandes){
    return this.https.post<any>(this.apiCreateBonLivraison,{livraison,livraisonDetail,commande});
  }

  public getDetailLivraisonByLivraisonId(livraisonId:number){
    return this.https.get<any>(this.apiGetDetailLivraisonByLivraisonId+livraisonId);
  }

  public deleteBonLivraison(livraison:InterfaceBonLivraisons){
    return this.https.post<any>(this.apiDeleteBonLivraison,livraison)
  }
}
