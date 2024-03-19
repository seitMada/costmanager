import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupeAnalytiqueService {
  
  private apiGetGroupeAnalytique = environment.APIGETGROUPE;

  constructor(private https: HttpClient) { }

  public getGroupeAnalytique() {
    return this.https.get<any>(this.apiGetGroupeAnalytique);
  }
}
