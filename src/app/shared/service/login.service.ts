import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InterfaceOperateur } from "../model/interfaceOperateur";
import { Router } from '@angular/router';
import { Observable} from 'rxjs';
import { first,tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiAuth = environment.APILOGIN

  constructor(
    private https: HttpClient,
    private router: Router
  ) { }

  operateurId: Pick<InterfaceOperateur,"id">;

  public auth(operateurData:any) {
    return this.https.post(this.apiAuth, operateurData).subscribe(
      response => {
        if(response==true){
          this.router.navigate(['dash']);
        }
      }
    )
  }

  public logout(operateurData:any){
    return this.https.post(this.apiAuth,operateurData).subscribe(
      response=>{
        if (response==true) {
          this.router.navigate(['login']);
        } else {
          
        }
      }
    )
  }
}
