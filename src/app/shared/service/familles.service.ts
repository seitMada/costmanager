import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FamillesService {

  private apiGetFamillesByGroupe = environment.APIGETFAMILLEBYGROUPE;
  private apiGetFamillesByType = environment.APIGETFAMILLEBYTYPE;

  constructor(private https: HttpClient) { }

  public getFamilleByGroupe(groupe: any) {
    return this.https.get<any>(this.apiGetFamillesByGroupe + groupe.groupeId + '/' + groupe.type);
  }

  public getFamilleByType(type: any) {
    return this.https.get<any>(this.apiGetFamillesByType + type);
  }

}
