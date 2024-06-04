import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InterfaceLieustockages } from '../model/interface-lieustockages';
import { InterfaceCentreRevenu } from '../model/interface-centrerevenu';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LieustockageService {
  private apiCreateLieuStockage = environment.APICREATELIEUSTOCKAGE;

  constructor(private https:HttpClient) { }

  public createLieuStockage(lieu:InterfaceLieustockages,centre: InterfaceCentreRevenu){
    return this.https.post<any>(this.apiCreateLieuStockage,{lieu,centre});
  }
}
