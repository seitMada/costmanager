import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private apiGetFournisseur = environment.APIGETFOURNISSEUR
  private apiOneFournisseur = environment.APIONEFOURNISSEUR

  constructor(private https:HttpClient) { }

  public getAllFournisseur(){
    return this.https.get<any>(this.apiGetFournisseur);
  }

  public getOneFournisseur(fournisseurId:number){
    return this.https.get<any>(this.apiOneFournisseur+fournisseurId);
  }
}
