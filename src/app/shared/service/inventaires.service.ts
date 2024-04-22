import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InterfaceInventaires, InterfaceInventairesDetails } from '../model/interface-inventaires';

@Injectable({
  providedIn: 'root'
})
export class InventairesService {
  private apiGetInventaireByCentreAndDate = environment.APIGETINVENTAIREBYCRANDDATE;
  private apiCreateInventaire = environment.APICREATEINVENTAIRE;
  private apiDeleteInventaire = environment.APIDELETEINVENTAIRE;
  private apiDeletesInventaire = environment.APIDELETESINVENTAIRE;
  private apiUpdateInventaire = environment.APIUPDATEINVENTAIRE;
  private apiGetInventaireById = environment.APIGETINVENTAIREBYID;

  constructor(private https: HttpClient) { }

  getInventaireByCrAndDate(centreId: number, dateDebut: string, dateFin: string) {
    return this.https.post(this.apiGetInventaireByCentreAndDate, { id: centreId, dateDebut: dateDebut, dateFin: dateFin });
  }

  createInventaire(_inventaire: InterfaceInventaires, _inventairedetails: InterfaceInventairesDetails[]) {
    return this.https.post(this.apiCreateInventaire, { inventaire: _inventaire, inventairedetails: _inventairedetails });
  }

  public deleteInventaire(_inventaire: InterfaceInventaires) {
    return this.https.post(this.apiDeleteInventaire, _inventaire);
  }

  public deleteInventaires(id: number[]) {
    return this.https.post(this.apiDeletesInventaire, { id: id });
  }

  public updateInventaire(_inventaire: InterfaceInventaires) {
    return this.https.patch(this.apiUpdateInventaire, { inventaire: _inventaire, inventairedetail: _inventaire.inventairedetail });
  }

  public getInventaireById(id: number) {
    return this.https.get<any>(this.apiGetInventaireById + id);
  }
}
