import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BonlivraisonService {

  constructor(private https:HttpClient) { }

  public getListLivraisonByFournisseurExploitation(fournisseurId:number,exploitationId:number){

  }

  public getListArticleInCommandeValidate(fournisseurId:number,exploitationId:number){

  }
}
