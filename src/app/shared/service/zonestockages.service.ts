import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { InterfaceZonestockages } from '../model/interface-zonestockages';

@Injectable({
  providedIn: 'root'
})
export class ZonestockagesService {

  private apiGetLieuStockageByCentreId = environment.APIGETLIEUSTOCKAGEBYCENTREID;
  private apiGetZoneStockageByLieuId = environment.APIGETZONESTOCKAGEBYLIEUID;
  private apiGetZoneStockageByExploitationId = environment.APIGETZONESTOCKAGEBYEXPLOITATIONID;
  
  private apiDeleteArticleZonestockage = environment.APIDELETEARTICLEZONESTOCKAGE;
  private apiGetAllZoneStockageWithoutLinks = environment.APIGETALLZONESTOCKAGEWITHOUTLINKS;
  private apiCreateZoneDeStockage = environment.APICREATEZONEDESTOCKAGE;
  private apiGetListZoneWithoutLinks = environment.APIGETLISTZONEWITHOUTLINKSBYLIEUID;
  private apiGetZoneDeStockage = environment.APIGETALLZONESTOCKAGE;
  private apiUpdateZoneDeStockage = environment.APIUPDATEZONESTOCKAGE;
  private apiDeleteZoneStockage = environment.APIDELETEZONESTOCKAGE;

  constructor(private https: HttpClient) { }

  getAllZoneDeStockage(){
    return this.https.get<any>(this.apiGetZoneDeStockage);
  }

  getAllZoneStockageWithoutLinks(){
    return this.https.get<any>(this.apiGetAllZoneStockageWithoutLinks);
  }

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

  createZoneDeStockage(zone:InterfaceZonestockages){
    return this.https.post<any>(this.apiCreateZoneDeStockage,zone);
  }

  updateZoneDeStockage(zone:InterfaceZonestockages){
    return this.https.post<any>(this.apiUpdateZoneDeStockage,zone);
  }

  getListZoneWithoutLinksByLieuId(lieuId:number){
    return this.https.get<any>(this.apiGetListZoneWithoutLinks+lieuId);
  }

  deleteZoneStockage(zone:InterfaceZonestockages){
    return this.https.post<any>(this.apiDeleteZoneStockage,zone);
  }
}
