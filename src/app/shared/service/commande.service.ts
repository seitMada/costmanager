import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  constructor(private https:HttpClient) { }

  private apiGetCommande = environment.APIGETCOMMANDE;
  private apiCreateCommande = environment.APICREATECOMMANDE;
  private apiGetArticleByFournisseurIdAndExploitationId = environment.APIGETARTICLEBYFOURNISSEURIDANDEXPLOITATIONID;

  public getAllCommande(){
    return this.https.get<any>(this.apiGetCommande);
  }

  public createBonCommande(commande:any){
    return this.https.post<any>(this.apiCreateCommande,commande);
  }

  public getArticleFournisseurByFournisseurId(fournisseurId:number,exploitationId:any){
    return this.https.get<any>(this.apiGetArticleByFournisseurIdAndExploitationId + fournisseurId+'/'+exploitationId);
  }

  // public getArticleExploitationByExploitationId(exploitationId:any){
  //   return this.https.get<any>(this.apiGetArticleExploitationByExploitationId + exploitationId);
  // }

}
