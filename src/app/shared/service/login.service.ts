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
  
  httpOptions: { headers:HttpHeaders} ={
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };


  public auth(email:Pick<InterfaceOperateur,"email">,mdp:Pick<InterfaceOperateur,"mdp">,exploitationId:number,centreId:number):Observable<{operateurId:Pick<InterfaceOperateur,"id">}> {
    const data = [email,mdp,exploitationId,centreId];
    return this.https.post<{operateurId:Pick<InterfaceOperateur,"id">}>(this.apiAuth, data,this.httpOptions).pipe(
      first(),
      tap(() =>{
        this.router.navigate(['dash']);
      })
    )
  }
}
