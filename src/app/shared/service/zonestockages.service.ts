import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZonestockagesService {

  private apiGetLieuStockageByCentreId = environment.APIGETLIEUSTOCKAGEBYCENTREID;
  private apiGetZoneStockageByLieuId = environment.APIGETZONESTOCKAGEBYLIEUID;

  constructor(private https: HttpClient) { }

  getLieuStockageByCentreId(centreId: number) {
    return this.https.post(this.apiGetLieuStockageByCentreId, { centreId: centreId });
  }

  getZoneStockageByLieuId(lieuId: number) {
    return this.https.post(this.apiGetZoneStockageByLieuId, { lieuId: lieuId });
  }
}
