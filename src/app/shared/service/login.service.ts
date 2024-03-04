import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { InterfaceOperateur } from "../model/interfaceOperateur";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiAuth = environment.APILOGIN

  constructor(private https: HttpClient) { }

  public operateurData: InterfaceOperateur = {
    id:                 0,
    nom:                '',
    prenom:             '',
    nomConnexion:       '',
    email:              '',
    mdp:                '',
    connecter:          0,
    actif:              0,
    loginError:         0,
    exploitationId:     0,
    centreId:           0
  }

  public auth(operateurData: any) {
    return this.https.post(this.apiAuth, operateurData).subscribe(
      response => {
        console.log(response);
      }
    )
  }
}
