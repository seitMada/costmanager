import { InterfaceFournisseur, InterfaceFournisseurs } from "./interface-fournisseurs";
export class Fournisseur implements InterfaceFournisseurs {
  fournisseurs:InterfaceFournisseur[];

  constructor(fournisseurs:InterfaceFournisseur[]) {
    this.fournisseurs = fournisseurs;
  }

  *[Symbol.iterator](){
    for (let fournisseur of this.fournisseurs) {
      yield fournisseur;
    }
  }
}