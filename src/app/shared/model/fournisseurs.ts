import { InterfaceFournisseur } from "./interface-fournisseurs";

// export class Fournisseur implements InterfaceFournisseurs {
//   fournisseurs: InterfaceFournisseur[];

//   constructor(fournisseurs: InterfaceFournisseur[]) {
//     this.fournisseurs = fournisseurs;
//   }

//   // Implémentation de l'itérateur Symbol.iterator
//   // *[Symbol.iterator]() {
//   //   for (let fournisseur of this.fournisseurs) {
//   //     yield fournisseur;
//   //   }
//   // }
// }

export class Fournisseur implements InterfaceFournisseur {
  id?: number | undefined;
  raison_social: string;
  actif: boolean;
  codeFournisseur: string;
  siret: string;
  codeNaf: string;
  tvaIntracom: string;
  web: string;
  codeComptable: string;
  modereglementId: number;
  commentaires: string;


  constructor(fournisseurInterface: InterfaceFournisseur = {
    raison_social:  '',
    actif: true,
    codeFournisseur:  '',
    siret:  '',
    codeNaf:  '',
    tvaIntracom:  '',
    web:  '',
    codeComptable:  '',
    modereglementId: 0,
    commentaires:  '',
  }) {
    this.raison_social =fournisseurInterface.raison_social ;
    this.actif =fournisseurInterface.actif;
    this.codeFournisseur =fournisseurInterface.codeFournisseur ;
    this.siret =fournisseurInterface.siret ;
    this.codeNaf =fournisseurInterface.codeNaf ;
    this.tvaIntracom =fournisseurInterface.tvaIntracom ;
    this.web =fournisseurInterface.web ;
    this.codeComptable =fournisseurInterface.codeComptable ;
    this.modereglementId =fournisseurInterface.modereglementId;
    this.commentaires =fournisseurInterface.commentaires ;
  }
}