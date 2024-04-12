import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventairesService {
  private apiGetInventaireByCentreAndDate = environment.APIGETINVENTAIREBYCRANDDATE;

  constructor(private https: HttpClient) { }

  getInventaireByCrAndDate(centreId: number, dateDebut: string, dateFin: string) {
    return this.https.post(this.apiGetInventaireByCentreAndDate, { id: centreId, dateDebut: dateDebut, dateFin: dateFin });
  }
}
