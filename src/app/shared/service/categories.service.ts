import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private apiGetCategories = environment.APIGETCATEGORIES;

  constructor(private https: HttpClient) { }

  public getCategories() {
    return this.https.get<any>(this.apiGetCategories);
  }
}
