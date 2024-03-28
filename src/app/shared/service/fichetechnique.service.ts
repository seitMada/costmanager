import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FichetechniqueService {

  private apiGetFichetechniqueByExploitation = environment.APIGETFICHETECHNIQUEBYEXPLOITATION;

  constructor(private https: HttpClient) { }

  public getFichetechniqueByExploitation(id: number){
    return this.https.get<any>(this.apiGetFichetechniqueByExploitation + id)
  }
}
