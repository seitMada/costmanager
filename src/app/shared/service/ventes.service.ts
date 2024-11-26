import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VentesService {

  private apiGetVenteCrDate = environment.APIGETVENTEBYCRANDDATE;
  private apiAddVente = environment.APICREATEVENTE;
  private apiCountVente = environment.APICOUNTVENTE;
  private apiUploadVente = environment.APIUPLOADVENTE;
  private apiImportedVente = environment.APIIMPORTVENTE;

  constructor(private https: HttpClient) { }

  public getVenteCrDate(id: number[], dateDebut: string, dateFin: string, exploitation: boolean = false) {
    console.log(dateDebut)
    return this.https.post(this.apiGetVenteCrDate, { id: id, dateDebut: dateDebut, dateFin: dateFin, exploitation: exploitation });
  }

  public addVente(vente: any) {
    return this.https.post(this.apiAddVente, { vente: vente });
  }

  public getcount() {
    return this.https.get<number>(this.apiCountVente);
  }

  public uploadFileToBackend(file: any, fileName: string, idexploitation: number = 0) {
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('file', file);

    return this.https.post(this.apiUploadVente, formData);
  }

  public getimportedvente(id: number[]) {
    return this.https.post(this.apiImportedVente, { id: id });
  }
}
