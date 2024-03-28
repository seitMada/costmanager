
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceCategories } from "./interface-categories";
import { InterfaceFamilles } from "./interface-familles";
import { InterfaceUnite } from "./interface-unite";

export interface InterfaceFichetechnique {
    id?: number;
    libelle: string;
    categorieId: number;
    familleId: number;
    uniteId: number;
    prix: number;
    cout: number;
    image: string;
    selected?: boolean;

    exploitation: InterfaceExploitations[];
    categorie: InterfaceCategories;
    famille: InterfaceFamilles;
    unite: InterfaceUnite;
}

export interface InterfaceFichetechniques {
    fichetechniques: InterfaceFichetechnique[];
  }
