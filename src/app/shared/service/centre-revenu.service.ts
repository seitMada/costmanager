import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { InterfaceCentreRevenu } from '../model/interface-centrerevenu';
import { InterfaceLieustockages } from '../model/interface-lieustockages';

@Injectable({
  providedIn: 'root'
})
export class CentreRevenuService {

  private apiGetCRExploitation = environment.APIGETCREXPLOITATION;
  private apiGetcentrerevenu = environment.APIGETCENTREREVENUS;
  private apiUpdateCentreRevenu = environment.APIUPDATECENTREREVENUS;
  private apiDeleteCentreRevenu = environment.APIDELETECENTREREVENU;
  private apiCreateCentreRevenu = environment.APICREATECENTREREVENUS;
  private apiGetAllCentreRevenuWithoutLinks = environment.APIGETCENTREWITHOUTLINKS;

  constructor(private https: HttpClient) { }

  public getCrExploitation(idExploitation: number) {
    return this.https.get<any>(this.apiGetCRExploitation + idExploitation)
  }

  public getcentrerevenu() {
    return this.https.get<any>(this.apiGetcentrerevenu)
  }

  public createCentreRevenu(centre:InterfaceCentreRevenu,lieuStockages:InterfaceLieustockages[]){
    return this.https.post<any>(this.apiCreateCentreRevenu,{centre,lieuStockages});
  }

  public updateCentreRevenu(centre:InterfaceCentreRevenu){
    return this.https.patch<any>(this.apiUpdateCentreRevenu + centre.id,centre);
  }

  public deleteCentreRevenu(centre:InterfaceCentreRevenu){
    return this.https.post<any>(this.apiDeleteCentreRevenu, centre);
  }

  public getAllCentreRevenuWithoutLinks(){
    return this.https.get<any>(this.apiGetAllCentreRevenuWithoutLinks);
  }
}
