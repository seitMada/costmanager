import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InterfaceAchat } from '../model/interface-achats';

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  constructor(private https:HttpClient) { }

  private apiCreateFacture = environment.APICREATEFACTURE;
  private apiGetFactureByFournisseurExploitation = environment.APIGETFACTUREBYFOURNISSEUREXPLOITATION;

  public getFactureByFournisseurExploitation(fournisseurId:number,exploitationId:number){
    return this.https.get<any>(this.apiGetFactureByFournisseurExploitation+fournisseurId, { params: { exploitationId: exploitationId } });
  }

  public createFacture(facture:InterfaceAchat){
    return this.https.post<any>(this.apiCreateFacture,{facture});
  }
}
