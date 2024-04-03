import { InterfaceCategories, InterfaceCategoriess } from "./interface-categories";

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

export class Categories implements InterfaceCategoriess {
  categories: InterfaceCategories[]

  constructor(categories: InterfaceCategories[]){
      this.categories = categories;
  }

  *[Symbol.iterator]() {
      for (let categorie of this.categories) {
          yield categorie;
      }
  }
}