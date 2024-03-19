import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UnitesService {

  private apiGetUnite = environment.APIGETUNITE;

  constructor(private https: HttpClient) { }

  public getUnite() {
    return this.https.get<any>(this.apiGetUnite);
  }
}
