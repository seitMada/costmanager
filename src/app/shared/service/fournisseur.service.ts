import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InterfaceFournisseur } from '../model/interface-fournisseurs';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private apiGetFournisseur = environment.APIGETFOURNISSEUR;
  private apiGetFournisseurByExploitation = environment.APIGETFOURNISSEURBYEXPLOITATION;
  private apiOneFournisseur = environment.APIONEFOURNISSEUR;
  private apiFournisseurById = environment.APIFOURNISSEURBYID;
  private apiUpdateFournisseur = environment.APIUPDATEFOURNISSEUR;
  private apiAddFournisseur = environment.APIADDFOURNISSEUR;

  private apiUpdateFournisseurExploitation = environment.APIUPDATEFOURNISSEUREXPLOITATION;
  private apiGetExploitationByFournisseur = environment.APIGETEXPLOITATIONBYFOURNISSEUR;

  private apiGetAdresse = environment.APIGETADRESS;

  constructor(private https: HttpClient) { }

  public getAllFournisseur() {
    return this.https.get<any>(this.apiGetFournisseur);
  }
  
  public getAllFournisseurByExploitation(id: number) {
    return this.https.get<any>(this.apiGetFournisseurByExploitation + id);
  }

  public getOneFournisseur(fournisseur: InterfaceFournisseur) {
    return this.https.get<any>(this.apiOneFournisseur + fournisseur);
  }

  public getFournisseurById(id: number) {
    return this.https.get<any>(this.apiFournisseurById + id);
  }

  public updateFournisseur(id: number, fournisseur: InterfaceFournisseur) {
    return this.https.patch(this.apiUpdateFournisseur + id, fournisseur);
  }

  public addFournisseur(fournisseur: InterfaceFournisseur) {
    return this.https.post(this.apiAddFournisseur, fournisseur);
  }

  public getAllAdresse() {
    return this.https.get<any>(this.apiGetAdresse);
  }

  public updateFournisseurExploitation(id: number, exploitationid: number[]) {
    return this.https.post(this.apiUpdateFournisseurExploitation + id, exploitationid);
  }

  public getAllExploitationByFournisseur(id: number) {
    return this.https.get<any>(this.apiGetExploitationByFournisseur + id);
  }
}
