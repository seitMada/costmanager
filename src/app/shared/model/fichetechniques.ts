import { InterfaceCategories } from "./interface-categories";
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceFamilles } from "./interface-familles";
import { InterfaceFichetechnique } from "./interface-fichetechnique";
import { InterfaceGroupeanalytiques } from "./interface-groupeanalytiques";
import { InterfaceUnite } from "./interface-unite";
import { InterfaceComposition, InterfaceCompositions } from "./interface-compositions";

export class Fichetechnique implements InterfaceFichetechnique {
    fichetechniques: InterfaceFichetechnique[];

    id?: number | undefined;
    libelle: string;
    categorieId: number;
    familleId: number;
    uniteId: number;
    prix: number;
    cout: number;
    image: string;
    groupeanalytiqueId: number;

    exploitation: InterfaceExploitations[];
    categorie: InterfaceCategories;
    famille: InterfaceFamilles;
    unite: InterfaceUnite;
    groupeanalytique: InterfaceGroupeanalytiques;

    constructor(fichetechniques: InterfaceFichetechnique[]) {
        this.fichetechniques = fichetechniques;
    }

    *[Symbol.iterator]() {
        for (let fichetechnique of this.fichetechniques) {
            yield fichetechnique;
        }
    }
}

export class Composition implements InterfaceComposition {
    id?: number | undefined;
    fichetechniqueId: number;
    articleId: number;
    quantite: number;
    uniteId: number;

    constructor(compositionInterface: InterfaceComposition = {
        fichetechniqueId: 0,
        articleId: 0,
        quantite: 0,
        uniteId: 0,
    }) {
        this.fichetechniqueId = compositionInterface.fichetechniqueId;
        this.articleId = compositionInterface.articleId;
        this.quantite = compositionInterface.quantite;
        this.uniteId = compositionInterface.uniteId;
    }
}

export class Compositions implements InterfaceCompositions {
    compositions: InterfaceComposition[];

    constructor(compositions: InterfaceComposition[]) {
        this.compositions = compositions;
      }
    
      *[Symbol.iterator]() {
        for (let composition of this.compositions) {
          yield composition;
        }
      }
}