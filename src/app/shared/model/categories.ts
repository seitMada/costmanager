import { InterfaceCategories } from "./interface-categories";

export class Categorie implements InterfaceCategories {
  id?: number | undefined;
  code: string;
  libelle: string;
  actif: boolean;

  constructor(categorieInterface: InterfaceCategories = {
    code: '',
    libelle: '',
    actif: true,
  }) {
    this.code= categorieInterface.code;
    this.libelle= categorieInterface.libelle;
    this.actif= categorieInterface.actif;
  }
}