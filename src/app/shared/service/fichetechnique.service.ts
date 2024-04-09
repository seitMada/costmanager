import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Fichetechnique } from '../model/fichetechniques';
import { InterfaceFichetechnique } from '../model/interface-fichetechnique';
import { InterfaceComposition } from '../model/interface-compositions';

@Injectable({
  providedIn: 'root'
})
export class FichetechniqueService {

  private apiGetFichetechniqueByExploitation = environment.APIGETFICHETECHNIQUEBYEXPLOITATION;
  private apiAddFichetechnique = environment.APIADDFICHETECHNIQUE;
  private apiUpdateFichetechniqueExploitation = environment.APIUPDATEFICHETECHNIQUEEXPLOITATION;
  private apiGetExploitationByFichetechnique = environment.APIGETEXPLOITATIONBYFICHETECHNIQUE;
  private apiUpdateFichetechnique = environment.APIUPDATEFICHETECHNIQUE;
  private apiGetFichetechniqueById = environment.APIGETFICHETECHNIQUEBYID;

  private apiPostDesactiveFichetechnique = environment.APIPOSTDESACTIVEFICHETECHNIQUE;
  private apiPostDesactiveFichetechniques = environment.APIPOSTDESACTIVEFICHETECHNIQUES;
  private apiDeleteFichetechnique = environment.APIPOSTDELETEFICHETECHNIQUE;
  private apiDeleteFichetechniques = environment.APIPOSTDELETEFICHETECHNIQUES;

  private apiUpdateComposition = environment.APIUPDATECOMPOSITION;
  private apiGetCompositionByFichetechnique = environment.APIGETCOMPOSITIONBYFICHETECHNIQUE;

  constructor(private https: HttpClient) { }

  public getFichetechniqueByExploitation(id: number){
    return this.https.get<any>(this.apiGetFichetechniqueByExploitation + id)
  }

  public addFichetechnique(fichetechnique: InterfaceFichetechnique) {
    return this.https.post(this.apiAddFichetechnique, fichetechnique);
  }

  public updateFichetechniqueExploitation(id: number, exploitationid: number[]) {
    return this.https.post(this.apiUpdateFichetechniqueExploitation + id, exploitationid);
  }

  public getAllExploitationByFichetechnique(id: number) {
    return this.https.get<any>(this.apiGetExploitationByFichetechnique + id);
  }

  public updateFichetechnique(id: number, fichetechnique: InterfaceFichetechnique) {
    return this.https.patch(this.apiUpdateFichetechnique + id, fichetechnique);
  }

  public getFichetechniqueById(id: number){
    return this.https.get<any>(this.apiGetFichetechniqueById + id)
  }

  public deleteFichetechnique(fichetechnique: InterfaceFichetechnique) {
    return this.https.post(this.apiDeleteFichetechnique, fichetechnique);
  }

  public deleteFichetechniques(id: number[]) {
    return this.https.post(this.apiDeleteFichetechniques, id);
  }

  public desactiveFichetechnique(id: number, exploitationid: number[]) {
    return this.https.post(this.apiPostDesactiveFichetechnique + id, exploitationid);
  }

  public desactiveFichetechniques(data: any) {
    return this.https.post(this.apiPostDesactiveFichetechniques, data);
  }

  public updateComposition(id: number, composition: InterfaceComposition[]) {
    return this.https.post(this.apiUpdateComposition + id, composition);
  }

  public getCompositionByFichetechnique(id: number) {
    return this.https.get<any>(this.apiGetCompositionByFichetechnique + id);
  }
}
