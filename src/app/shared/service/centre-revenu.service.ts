import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CentreRevenuService {

  private apiGetCRExploitation = environment.APIGETCREXPLOITATION

  constructor(private https: HttpClient) { }

  public getCrExploitation(idExploitation: number) {
    return this.https.get<any>(this.apiGetCRExploitation + idExploitation)
  }
}
