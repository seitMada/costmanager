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
  private apiGetArticleFournisseurById = environment.APIGETARTICLEFOURNISSEURBYID;
  private apiGetArticleExploitationById = environment.APIGETARTICLEEXPLOITATIONBYID;

  public getAllCommande(){
    return this.https.get<any>(this.apiGetCommande);
  }

  public createBonCommande(commande:any){
    return this.https.post<any>(this.apiCreateCommande,commande);
  }

  public getArticleFournisseurByFournisseurId(fournisseurId:number,articleId:any[]){
    return this.https.post<any>(this.apiGetArticleByFournisseurIdAndExploitationId + fournisseurId,articleId);
  }

  public getArticleFournisseurById(validateArticleId:any[]){
    return this.https.post<any>(this.apiGetArticleFournisseurById,validateArticleId);
  }

 public getArticleExploitation(exploitationId:number){
  return this.https.get<any>(this.apiGetArticleExploitationById+exploitationId);
 }

}
