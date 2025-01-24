import { InterfaceAllergeneArticle } from "./interface-allergenes";
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceCategories } from "./interface-categories";
import { InterfaceFamilles } from "./interface-familles";
import { InterfaceSousfamilles } from "./interface-sousfamilles";
import { InterfaceUnite } from "./interface-unite";
import { InterfaceGroupeanalytiques } from "./interface-groupeanalytiques";
import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";
import { InterfaceArticlezonestockages } from "./interface-articlezonestockages";
import { IntefaceConditionnement } from "./inteface-conditionnements";
import { InterfaceArticleExploitation } from "./interface-articleexploitations";

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
  cout: number;
  selected?: boolean;
  stockminimum?: number;
  stock?: number;

  allergeneArticle: InterfaceAllergeneArticle[];
  articleexploitation: InterfaceArticleExploitation[];
  articlefournisseur: InterfaceArticlefournisseurs[];
  categories: InterfaceCategories;
  familles: InterfaceFamilles;
  sousfamilles: InterfaceSousfamilles;
  unite: InterfaceUnite;
  groupeanalytique: InterfaceGroupeanalytiques;
  articlezonestockages: InterfaceArticlezonestockages[];
  conditionnement?: IntefaceConditionnement;

  composition?: any[];
}

export interface InterfaceArticles {
  articles: InterfaceArticle[];
}