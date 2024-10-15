import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InterfaceInventaires, InterfaceInventairesDetails } from '../model/interface-inventaires';

@Injectable({
  providedIn: 'root'
})
export class InventairesService {
  private apiGetInventaireByCentreAndDateGroupNumero = environment.APIGETINVENTAIREBYCRANDDATEGROUPENUMERO;
  private apiCreateInventaire = environment.APICREATEINVENTAIRE;
  private apiDeleteInventaire = environment.APIDELETEINVENTAIRE;
  private apiDeletesInventaire = environment.APIDELETESINVENTAIRE;
  private apiUpdateInventaire = environment.APIUPDATEINVENTAIRE;
  private apiGetInventaireById = environment.APIGETINVENTAIREBYID;
  private apiGetInventaireDetailsByNumero = environment.APIGETINVENTAIREDETAILBYNUMERO;
  private apiGetPeriode = environment.APIGETPERIODE;
  private apiGetLastPeriodeInventaire = environment.APIGETLASTPERIODEINVENTAIRE;



  constructor(private https: HttpClient) { }

  // getInventaireByCrAndDate(centreId: number, dateDebut: string, dateFin: string) {
  //   return this.https.post(this.apiGetInventaireByCentreAndDate, { id: centreId, dateDebut: dateDebut, dateFin: dateFin });
  // }

  getInventaireByCrAndDate(centreId: number, dateDebut: string, dateFin: string) {
    return this.https.post(this.apiGetInventaireByCentreAndDateGroupNumero, { id: centreId, dateDebut: dateDebut, dateFin: dateFin });
  }

  getInventaireDetailsByNumero(numero: string) {
    return this.https.post(this.apiGetInventaireDetailsByNumero, { numero: numero });
  }

  createInventaire(_inventaire: any) {
    return this.https.post(this.apiCreateInventaire, { inventaire: _inventaire });
  }

  // createInventaire(_inventaire: InterfaceInventaires, _inventairedetails: InterfaceInventairesDetails[]) {
  //   return this.https.post(this.apiCreateInventaire, { inventaire: _inventaire, inventairedetails: _inventairedetails });
  // }

  public deleteInventaire(_numero: string) {
    return this.https.post(this.apiDeleteInventaire, { numero: _numero });
  }

  public deleteInventaires(_numero: string[]) {
    return this.https.post(this.apiDeletesInventaire, { numero: _numero });
  }

  // public deleteInventaires(id: number[]) {
  //   return this.https.post(this.apiDeletesInventaire, { id: id });
  // }

  public updateInventaire(_inventaire: any, _numero: string) {
    return this.https.patch(this.apiUpdateInventaire, { inventaire: _inventaire, numero: _numero });
  }

  // public updateInventaire(_inventaire: InterfaceInventaires) {
  //   return this.https.patch(this.apiUpdateInventaire, { inventaire: _inventaire, inventairedetail: _inventaire.inventairedetail });
  // }

  public getInventaireById(id: number) {
    return this.https.get<any>(this.apiGetInventaireById + id);
  }

  public getPeriode(id: number[], isexploitation: boolean = false) {
    return this.https.post(this.apiGetPeriode, { id: id, isexploitation: isexploitation });
  }

  public getLastPeriodeInventaire(operateurId: number, exploitationId: number[]) {
    return this.https.post(this.apiGetLastPeriodeInventaire, { operateurId, exploitationId });
  }


}
