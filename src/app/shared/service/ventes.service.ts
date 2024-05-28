import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VentesService {

  private apiGetVenteCrDate = environment.APIGETVENTEBYCRANDDATE;
  private apiAddVente = environment.APICREATEVENTE;

  constructor(private https: HttpClient) { }

  // public getVenteCrDate() {
  //   return this.https.get<any>(this.apiGetVenteCrDate);
  // }

  public getVenteCrDate(id: number[], dateDebut: string, dateFin: string, exploitation: boolean = false) {
    return this.https.post(this.apiGetVenteCrDate, { id: id, dateDebut: dateDebut, dateFin: dateFin, exploitation: exploitation });
  }

  public addVente(vente: any) {
    return this.https.post(this.apiAddVente, { vente: vente });
  }
}
