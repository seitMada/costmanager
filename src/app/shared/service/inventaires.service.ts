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

  constructor(private https: HttpClient) { }

  getInventaireByCrAndDate(centreId: number, dateDebut: string, dateFin: string) {
    return this.https.post(this.apiGetInventaireByCentreAndDate, { id: centreId, dateDebut: dateDebut, dateFin: dateFin });
  }

  createInventaire(_inventaire: InterfaceInventaires, _inventairedetails: InterfaceInventairesDetails[]) {
    return this.https.post(this.apiCreateInventaire, { inventaire: _inventaire, inventairedetails: _inventairedetails });
  }
}
