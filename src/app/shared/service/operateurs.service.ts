import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { InterfaceOperateur } from "../model/interface-operateur";
import { InterfaceOperateurCentreExploitation } from '../model/interface-operateurcentreexploitation';

@Injectable({
  providedIn: 'root'
})
export class OperateursService {

  private apiAddOperateurFournisseur = environment.APIADDOPERATEUR;
  private apiGetOperateur = environment.APIGETOPERATEUR;
  private apiDeleteOperateur = environment.APIDELETEOPERATEUR;
  private apiDeleteOperateurs = environment.APIDELETEOPERATEURS;
  private apiUpdateOperateurs = environment.APIUPDATEOPERATEURS;
  private apiGetAllOperateur = environment.APIGETALLOPERATEUR;

  constructor(private https: HttpClient) { }

  createOperateur(operateur: InterfaceOperateur) {
    return this.https.post(this.apiAddOperateurFournisseur, operateur);
  }

  createNewOperateur(operateur: InterfaceOperateur,operateurcentreexploitation:InterfaceOperateurCentreExploitation) {
    return this.https.post(this.apiAddOperateurFournisseur, {operateur, operateurcentreexploitation});
  }

  getOperateur(fournisseurId: number) {
    return this.https.get<any>(this.apiGetOperateur + fournisseurId);
  }

  getAllOperateur(){
    return this.https.get<any>(this.apiGetAllOperateur);
  }

  deleteOperateur(operateur: InterfaceOperateur) {
    return this.https.post(this.apiDeleteOperateur, operateur);
  }

  deleteOperateurs(id: number, operateurId: number[]) {
    return this.https.post(this.apiDeleteOperateurs + id, operateurId);
  }

  public updateOperateur(id: number, operateur: InterfaceOperateur) {
    return this.https.patch(this.apiUpdateOperateurs + id, operateur);
  }
}
