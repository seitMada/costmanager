import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZonestockagesService {

  private apiGetLieuStockageByCentreId = environment.APIGETLIEUSTOCKAGEBYCENTREID;
  private apiGetZoneStockageByLieuId = environment.APIGETZONESTOCKAGEBYLIEUID;
  private apiGetZoneStockageByExploitationId = environment.APIGETZONESTOCKAGEBYEXPLOITATIONID;
  
  private apiDeleteArticleZonestockage = environment.APIDELETEARTICLEZONESTOCKAGE;

  constructor(private https: HttpClient) { }

  getLieuStockageByCentreId(centreId: number) {
    return this.https.post(this.apiGetLieuStockageByCentreId, { centreId: centreId });
  }

  getZoneStockageByLieuId(lieuId: number) {
    return this.https.post(this.apiGetZoneStockageByLieuId, { lieuId: lieuId });
  }

  getZoneStockageByExploitationId(exploitationId: number[]) {
    return this.https.post(this.apiGetZoneStockageByExploitationId, { exploitationId: exploitationId });
  }

  deleteArticleZoneStockage(articleId: number, zonestockageId: number[]) {
    return this.https.post(this.apiDeleteArticleZonestockage + articleId, zonestockageId);
  }
}
