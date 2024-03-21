import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiGetArticle = environment.APIGETARTICLE
  private apiGetArticleById = environment.APIGETARTICLEBYID

  constructor(private https: HttpClient){}

  public getAllArticle(){
    return this.https.get<any>(this.apiGetArticle)
  }

  public getArticlesById(id: number){
    return this.https.get<any>(this.apiGetArticleById + id)
  }
}
