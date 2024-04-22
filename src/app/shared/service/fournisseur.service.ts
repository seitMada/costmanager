import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InterfaceFournisseur } from '../model/interface-fournisseurs';
import { InterfaceArticlefournisseurs } from '../model/interface-articlefournisseurs';
import { IntefaceConditionnement } from '../model/inteface-conditionnements';

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

  private apiAddArticleFournisseur = environment.APIADDARTICLEFOURNISSEUR;
  private apiDeleteArticleFournisseur = environment.APIDELETEARTICLEFOURNISSEUR;

  private apiAddConditionnement = environment.APIADDCONDITIONNEMENT;
  private apiUpdateConditionnement = environment.APIUPDATECONDITIONNEMENT;
  private apiDeleteConditionnement = environment.APIDELETECONDITIONNEMENT;

  private apiDesactiveFournisseur = environment.APIPOSTDESACTIVEFOURNISSEUR;
  private apiDesactiveFournisseurs = environment.APIPOSTDESACTIVEFOURNISSEURS;

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

  public addArticleFournisseur(articleFournisseur: InterfaceArticlefournisseurs) {
    return this.https.post(this.apiAddArticleFournisseur, articleFournisseur);
  }

  public addConditionnement(conditionement: IntefaceConditionnement) {
    return this.https.post(this.apiAddConditionnement, conditionement);
  }

  public updateConditionnement(id: number, conditionement: IntefaceConditionnement) {
    return this.https.patch(this.apiUpdateConditionnement + id, conditionement);
  }

  public deleteConditionnement(conditionement: IntefaceConditionnement) {
    return this.https.post(this.apiDeleteConditionnement, conditionement);
  }

  public deleteArticleFournisseur(id: number) {
    return this.https.post(this.apiDeleteArticleFournisseur, { id: id });
  }

  public desactiveFournisseurExploitation(id: number, exploitationid: number[]) {
    return this.https.post(this.apiDesactiveFournisseur + id, exploitationid);
  }

  public desactiveFournisseursExploitation(data: any) {
    return this.https.post(this.apiDesactiveFournisseurs, data);
  }
}
