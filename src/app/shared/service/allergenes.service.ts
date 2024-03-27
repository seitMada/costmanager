import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InterfaceAllergenes } from "../model/interface-allergenes";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AllergenesService {

  private apiGetAllergenes = environment.APIGETALLERGENE;

  constructor(private https: HttpClient) { }

  public getAllAllergene(){
    return this.https.get<any>(this.apiGetAllergenes)
  }
}
