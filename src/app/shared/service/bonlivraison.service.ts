import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InterfaceBonLivraisons } from '../model/interface-bonLivraison';
import { InterfaceLivraisonDetails } from '../model/interface-livraisondetail';

@Injectable({
  providedIn: 'root'
})
export class BonlivraisonService {

  constructor(private https:HttpClient) { }

  private apiGetLivraisonByfournisseur = environment.APIGETLIVRAISONBYFOURNISSEUR;
  private apiGetCommandeByFournisseurExploitation = environment.APIGETCOMMANDEBYFOURNISSEUREXPLOITATIONVALIDATE;
  private apiGetDetailCommandeByCommandeId = environment.APIGETCOMMANDEDETAILBYCOMMANDEID;
  private apiCreateBonLivraison = environment.APICREATEBONLIVRAISON;

  public getListLivraisonByFournisseurExploitation(fournisseurId:number,exploitationId:number){
    return this.https.get<any>(this.apiGetLivraisonByfournisseur+fournisseurId, {params : {exploitationId:exploitationId}});
  }
  
  public getCommandeByFournisseurExploitationValidate(fournisseurId:number,exploitationId:number){
    return this.https.get<any>(this.apiGetCommandeByFournisseurExploitation+fournisseurId,{params : {exploitationId:exploitationId} });
  }

  public getListDetailCommandeByCommandeId(commandeId:number){
    return this.https.get<any>(this.apiGetDetailCommandeByCommandeId+commandeId);
  }

  public createNewBonLivraison(bonLivraison:InterfaceBonLivraisons,livraisonDetails:InterfaceLivraisonDetails[]){
    return this.https.post<any>(this.apiCreateBonLivraison,{bonLivraison,livraisonDetails});
  }
}
