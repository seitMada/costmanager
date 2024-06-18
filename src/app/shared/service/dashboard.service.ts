import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apivariationprixarticle = environment.APIVARIATIONARTICLE;

  constructor(private https: HttpClient) { }

  public getVariationArticle(idexploitation: number[], idarticle: number = 0) {
    return this.https.post(this.apivariationprixarticle, { id: idexploitation, idarticle: idarticle });
  }

}
