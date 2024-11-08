import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InterfacePpos } from '../model/interface-ppos';

@Injectable({
  providedIn: 'root'
})
export class PpoService {

  private apiGetPpoByCentreAndDate = environment.APIGETPPOBYCRANDDATE;
  private apiCreatePpo = environment.APICREATEPPO;
  private apiUpdatePpo = environment.APIUPDATEPPO;
  private apiDeletePpo = environment.APIDELETEPPO;
  private apiDeletePpos = environment.APIDELETESPPO;
  private apiPpoExploitation = environment.APIPPOEXPLOITATION;
  private apiPpoCentreRevenu = environment.APIPPOCENTREREVENU;
  private apiPpoDetailExploitation = environment.APIPPODETAILEXPLOITATION;
  private apiPpoDetailCentreRevenu = environment.APIPPODETAILCENTREREVENU;
  private apiGetPpoDetail = environment.APIGETPPODETAIL;
  private apiGetPpoDetailData = environment.APIGETPPODETAILDATA;
  private apiGetPpoDetailDataFamille = environment.APIGETPPODETAILDATAFAMILLE;
  private apiGetPpoStatistique = environment.APIGETPPOSTATISTIQUE;


  constructor(private https: HttpClient) { }

  getPpoByCrAndDate(id: number[], dateDebut: string, dateFin: string, exploitation: boolean = false) {
    return this.https.post(this.apiGetPpoByCentreAndDate, { id: id, dateDebut: dateDebut, dateFin: dateFin, exploitation: exploitation });
  }

  getPpoDetails(id: number[], dateDebut: string, dateFin: string, exploitation: boolean = false) {
    return this.https.post(this.apiGetPpoDetail, { id: id, dateDebut: dateDebut, dateFin: dateFin, exploitation: exploitation });
  }


  createPpo(ppo: InterfacePpos) {
    return this.https.post(this.apiCreatePpo, { ppo: ppo });
  }

  updatePpo(ppo: InterfacePpos) {
    return this.https.patch(this.apiUpdatePpo, { ppo: ppo });
  }

  deletePpo(id: number) {
    return this.https.post(this.apiDeletePpo, { id: id });
  }

  deletePpos(id: number[]) {
    return this.https.post(this.apiDeletePpos, { id: id });
  }

















  getPpoDetailData(data: any) {
    return this.https.post(this.apiGetPpoDetailData, data);
  }

  getPpoDetailDataFamille(data: any) {
    return this.https.post(this.apiGetPpoDetailDataFamille, data);
  }

  getPpoStatistique(articlesId: number[]) {
    return this.https.get(this.apiGetPpoStatistique, {})
  }
}
