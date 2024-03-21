import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { InterfaceOperateur } from "../model/interfaceOperateur";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiAuth = environment.APILOGIN
  private apiOperateurConnecte = environment.APIOPERATEURCONNECTE
  private apiLogout = environment.APILOGOUT;


  isLoggedIn:boolean = true;
  redirectUrl:string | null =null;

  constructor(
    private https: HttpClient,
    private router: Router
  ) { }

  operateurId: Pick<InterfaceOperateur,"id">;

  public auth(operateurData:any) {
    this.https.post(this.apiAuth, operateurData).subscribe(
      response => {
        if(response==true){
         this.https.get(this.apiOperateurConnecte,operateurData.email).subscribe(
            data =>{
              operateurData = data;
              this.isLoggedIn = true;
              this.router.navigate(['dash']);
              localStorage.setItem('operateurId',operateurData.id);
            }
          )
        }
      }
    )
  }

  public logout(){
    return this.https.post(this.apiLogout,this.operateurId).subscribe(
      response=>{
        if (response==true) {
          localStorage.removeItem('operateurId');
          this.router.navigate(['login']);

          this.isLoggedIn = false;
        } else {
          
        }
      }
    )
  }
}
