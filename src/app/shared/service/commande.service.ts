import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  constructor(private https:HttpClient) { }

  private apiGetCommande = environment.APIGETCOMMANDE

  public getAllCommande(){
    return this.https.get<any>(this.apiGetCommande);
  }
}
