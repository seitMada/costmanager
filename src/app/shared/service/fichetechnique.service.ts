import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Fichetechnique } from '../model/fichetechniques';
import { InterfaceFichetechnique } from '../model/interface-fichetechnique';
import { InterfaceComposition } from '../model/interface-compositions';
import { InterfaceCategories } from '../model/interface-categories';
import { InterfaceFamilles } from '../model/interface-familles';
import { InterfaceGroupeanalytiques } from '../model/interface-groupeanalytiques';
import { InterfaceUnite } from '../model/interface-unite';

@Injectable({
  providedIn: 'root'
})
export class FichetechniqueService {

  private apiGetFichetechniqueByExploitation = environment.APIGETFICHETECHNIQUEBYEXPLOITATION;
  private apiGetFichetechnique = environment.APIGETFICHETECHNIQUE;
  private apiAddFichetechnique = environment.APIADDFICHETECHNIQUE;
  private apiUpdateFichetechniqueExploitation = environment.APIUPDATEFICHETECHNIQUEEXPLOITATION;
  private apiGetExploitationByFichetechnique = environment.APIGETEXPLOITATIONBYFICHETECHNIQUE;
  private apiUpdateFichetechnique = environment.APIUPDATEFICHETECHNIQUE;
  private apiGetFichetechniqueById = environment.APIGETFICHETECHNIQUEBYID;
  private apiAddFichetechniqueExploitation = environment.APIPOSTADDFICHETECHNIQUEEXPLOITATION;

  private apiPostDesactiveFichetechnique = environment.APIPOSTDESACTIVEFICHETECHNIQUE;
  private apiPostDesactiveFichetechniques = environment.APIPOSTDESACTIVEFICHETECHNIQUES;
  private apiDeleteFichetechnique = environment.APIPOSTDELETEFICHETECHNIQUE;
  private apiDeleteFichetechniques = environment.APIPOSTDELETEFICHETECHNIQUES;

  private apiUpdateComposition = environment.APIUPDATECOMPOSITION;
  private apiGetCompositionByFichetechnique = environment.APIGETCOMPOSITIONBYFICHETECHNIQUE;

  constructor(private https: HttpClient) { }

  public getFichetechniqueByExploitation(id: number) {
    return this.https.get<any>(this.apiGetFichetechniqueByExploitation + id)
  }

  public getFichetechniques() {
    return this.https.get<any>(this.apiGetFichetechnique)
  }


  public addFichetechnique(fichetechnique: InterfaceFichetechnique) {
    return this.https.post(this.apiAddFichetechnique, fichetechnique);
  }

  public updateFichetechniqueExploitation(id: number, oldid: number, exploitationid: number[]) {

    return this.https.post(this.apiUpdateFichetechniqueExploitation + id, { exploitationid: exploitationid, oldid: oldid });
  }

  public getAllExploitationByFichetechnique(id: number) {
    return this.https.get<any>(this.apiGetExploitationByFichetechnique + id);
  }

  public updateFichetechnique(id: number, fichetechnique: InterfaceFichetechnique) {
    return this.https.patch(this.apiUpdateFichetechnique + id, fichetechnique);
  }

  public getFichetechniqueById(id: number) {
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

  public addFichetechniqueExploitation(id: number[], idexploitation: number) {
    return this.https.post(this.apiAddFichetechniqueExploitation, { idexploitation: idexploitation, id: id });
  }

  public resetFichetechnique() {
    const categorie: InterfaceCategories = {
      code: '',
      libelle: '',
      actif: false
    }
    const famille: InterfaceFamilles = {
      libelle: '',
      code_couleur: '',
      groupeId: 0,
      actif: false,
      type: ''
    }
    const unite: InterfaceUnite = {
      libelle: '',
      code: '',
      abreviation: '',
      step: 0,
      actif: false
    }
    const groupeAnalytique: InterfaceGroupeanalytiques = {
      code_groupe: '',
      groupe: '',
      actif: false,
      type: ''
    }
    const fichetechnique: InterfaceFichetechnique = {
      libelle: '',
      code: '',
      categorieId: 0,
      familleId: 0,
      uniteId: 0,
      prix: 0,
      cout: 0,
      image: '',
      groupeanalytiqueId: 0,

      exploitation: [],
      composition: [],
      categorie: categorie,
      famille: famille,
      unite: unite,
      groupeanalytique: groupeAnalytique,
    };
    return fichetechnique;
  }
}
