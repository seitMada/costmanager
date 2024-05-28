
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceCategories } from "./interface-categories";
import { InterfaceFamilles } from "./interface-familles";
import { InterfaceUnite } from "./interface-unite";
import { InterfaceGroupeanalytiques } from "./interface-groupeanalytiques";
import { InterfaceComposition, InterfaceCompositions } from "./interface-compositions";

export interface InterfaceFichetechnique {
    id?: number;
    libelle: string;
    code: string;
    categorieId: number;
    familleId: number;
    uniteId: number;
    groupeanalytiqueId: number;
    prix: number;
    cout: number;
    image: string;
    selected?: boolean;

    exploitation: InterfaceExploitations[];
    composition: InterfaceComposition[];
    categorie: InterfaceCategories;
    famille: InterfaceFamilles;
    unite: InterfaceUnite;
    groupeanalytique: InterfaceGroupeanalytiques;
}

export interface InterfaceFichetechniques {
    fichetechniques: InterfaceFichetechnique[];
}
