import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfserviceService {

  constructor() { }

  buildTableBody(tableau: any[], cle: any[], entete: { text: string; style: string; }[]) {
    const body = [];
    console.log(tableau)
    body.push(entete);
    tableau.forEach(function (row: { [x: string]: { toString: () => any; }; }) {
      const dataRow: string[] = [];
      cle.forEach(function (column: string) {
        if (column == 'Cout' || column == 'Valorisation' || column == 'Prix' || column == 'Montant') {
          const cout = Math.round(Number(row[column]) * 100) / 100;
          dataRow.push(cout.toString() + '€');
        } else {
          
          // console.log(row[column])
          dataRow.push((row[column] ? row[column] : '').toString());
        }
      })
      body.push(dataRow);
    });
    return body;
  }
}
