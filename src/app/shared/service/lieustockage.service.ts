import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InterfaceLieustockages } from '../model/interface-lieustockages';
import { InterfaceCentreRevenu } from '../model/interface-centrerevenu';
import { environment } from 'src/environments/environment';
import { InterfaceZonestockages } from '../model/interface-zonestockages';

@Injectable({
  providedIn: 'root'
})
export class LieustockageService {
  private apiCreateLieuStockage = environment.APICREATELIEUSTOCKAGE;
  private apiGetLieuStockageSansLien = environment.APIGETLIEUSTOCKAGESANSLIEN;
  private apiGetListLieuStockage = environment.APIGETLISTLIEUSTOCKAGE;
  private apiGetAllLieuStockage = environment.APIGETALLLIEUSTOCKAGE;
  private apiUpdateLieuStockage = environment.APIUPDATELIEUSTOCKAGE;
  private apiDeleteOneLieuStockage = environment.APIDELETEONELIEUSTOCKAGE;
  private apiGetLieuStockageByExploitationId = environment.APIGETLIEUSTOCKAGEBYEXPLOITATIONID;

  constructor(private https: HttpClient) { }

  public getAllLieuStockage() {
    return this.https.get<any>(this.apiGetAllLieuStockage);
  }

  public updateLieuDeStockage(lieu: InterfaceLieustockages, zonestockages: InterfaceZonestockages[]) {
    return this.https.patch<any>(this.apiUpdateLieuStockage + lieu.id, { lieu, zonestockages });
  }

  public createLieuStockage(lieu: InterfaceLieustockages, zonseStockages: InterfaceZonestockages[]) {
    return this.https.post<any>(this.apiCreateLieuStockage, { lieu, zonseStockages });
  }

  public findAllLieuStockageWithoutLinks() {
    return this.https.get<any>(this.apiGetLieuStockageSansLien);
  }

  public findListLieuStockage(centreId: number) {
    return this.https.get<any>(this.apiGetListLieuStockage + centreId);
  }

  public findListLieuStockageByExploitation(exploitationId: number) {
    return this.https.get<any>(this.apiGetLieuStockageByExploitationId + exploitationId);
  }

  public deleteOneLieuDeStockage(idLieu: number[]) {
    return this.https.post<any>(this.apiDeleteOneLieuStockage, idLieu);
  }
}
