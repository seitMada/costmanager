import { InterfaceAllergeneArticle } from "./interface-allergenes";
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceCategories } from "./interface-categories";
import { InterfaceFamilles } from "./interface-familles";
import { InterfaceSousfamilles } from "./interface-sousfamilles";
import { InterfaceUnite } from "./interface-unite";
import { InterfaceGroupeanalytiques } from "./interface-groupeanalytiques";
import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";

export interface InterfaceArticle {
  id?: number;
  codeArticle: string;
  libelle: string;
  groupeanalytiqueId: number;
  categoriesId: number;
  famillesId: number;
  sousfamillesId: number;
  uniteId: number;
  coefficientPonderation: number;
  actif: boolean;
  selected?: boolean;

  // Champs supplémentaires provenant des relations
  allergeneArticle: InterfaceAllergeneArticle[];
  articleexploitation: InterfaceExploitations[];
  articlefournisseur: InterfaceArticlefournisseurs[];
  categories: InterfaceCategories;
  familles: InterfaceFamilles;
  sousfamilles: InterfaceSousfamilles;
  unite: InterfaceUnite;
  groupeanalytique: InterfaceGroupeanalytiques;
}

export interface InterfaceArticles {
  articles: InterfaceArticle[];
}