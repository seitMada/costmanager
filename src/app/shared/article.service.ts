import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiGetArticle = environment.APIGETARTICLE

  constructor(private https: HttpClient){}

  public getAllArticle(){
    return this.https.get<any>(this.apiGetArticle)
  }
}
