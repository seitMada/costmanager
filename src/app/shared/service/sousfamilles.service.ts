import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SousfamillesService {

  private apiGetSousFamilleByFamille = environment.APIGETSOUSFAMILLEBYGROUPE;

  constructor(private https: HttpClient) { }

  public getSousFamilleByFamille(id: number) {
    return this.https.get<any>(this.apiGetSousFamilleByFamille + id);
  }
}
