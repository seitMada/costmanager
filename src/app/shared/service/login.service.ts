import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { InterfaceOperateur } from "../model/interface-operateur";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiAuth = environment.APILOGIN;
  private apiAuthAdmin = environment.APILOGINADMIN;
  private apiOperateurConnecte = environment.APIOPERATEURCONNECTE;
  private apiLogout = environment.APILOGOUT;

  redirectUrl: string | null = null;

  constructor(
    private https: HttpClient,
    private router: Router
  ) { }

  operateurId: Pick<InterfaceOperateur, "id">;

  public auth(operateurData: any) {
    // console.log(operateurData)
    // this.https.post(this.apiAuth, operateurData).subscribe(
    //   (response: any) => {
    //     if (response.connect === true) {
    //       sessionStorage.setItem('exploitation', operateurData.exploitationId);
    //       sessionStorage.setItem('id', response.id);
    //       sessionStorage.setItem('admin', (response.code === '0000' ? '1' : '0'));
    //       this.router.navigate(['dash']);
    //     }
    //   }
    // )
    return this.https.post(this.apiAuth, operateurData);
  }

  public logout(operateurId: any) {
    return this.https.post(this.apiLogout, operateurId).subscribe(
      response => {
        if (response == true) {
          sessionStorage.removeItem('id');
          sessionStorage.removeItem('centre');
          sessionStorage.removeItem('exploitation');
          this.router.navigate(['login']);
        }
      }
    )
  }
}
