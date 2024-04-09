import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { InterfaceOperateur } from "../model/interface-operateur";

@Injectable({
  providedIn: 'root'
})
export class OperateursService {

  private apiAddOperateurFournisseur = environment.APIADDOPERATEUR;
  private apiGetOperateur = environment.APIGETOPERATEUR;
  private apiDeleteOperateur = environment.APIDELETEOPERATEUR;
  private apiDeleteOperateurs = environment.APIDELETEOPERATEURS;
  private apiUpdateOperateurs = environment.APIUPDATEOPERATEURS;

  constructor(private https: HttpClient) { }

  createOperateur(operateur: InterfaceOperateur) {
    return this.https.post(this.apiAddOperateurFournisseur, operateur);
  }

  getOperateur(fournisseurId: number) {
    return this.https.get<any>(this.apiGetOperateur + fournisseurId);
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
