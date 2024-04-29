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

  constructor(private https: HttpClient) { }

  getPpoByCrAndDate(centreId: number, dateDebut: string, dateFin: string) {
    return this.https.post(this.apiGetPpoByCentreAndDate, { id: centreId, dateDebut: dateDebut, dateFin: dateFin });
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
}
