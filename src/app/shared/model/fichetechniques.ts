import { InterfaceCategories } from "./interface-categories";
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceFamilles } from "./interface-familles";
import { InterfaceFichetechnique } from "./interface-fichetechnique";
import { InterfaceGroupeanalytiques } from "./interface-groupeanalytiques";
import { InterfaceUnite } from "./interface-unite";
import { InterfaceComposition, InterfaceCompositions } from "./interface-compositions";
import { InterfaceArticle } from "./interface-articles";

export class Fichetechnique implements InterfaceFichetechnique {
    fichetechniques: InterfaceFichetechnique[];

    id?: number | undefined;
    libelle: string;
    code: string;
    categorieId: number;
    familleId: number;
    uniteId: number;
    prix: number;
    cout: number;
    image: string;
    groupeanalytiqueId: number;

    exploitation: InterfaceExploitations[];
    composition: InterfaceComposition[];
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
    articleId: number | null;
    ftId: number | null;
    quantite: number;
    uniteId: number;
    cout: number;

    article: InterfaceArticle | null;

    fichetechniqueCompositon: InterfaceFichetechnique | null;
    unite: InterfaceUnite;

    constructor(compositionInterface: InterfaceComposition) {
        this.fichetechniqueId = compositionInterface.fichetechniqueId;
        this.articleId = compositionInterface.articleId;
        this.ftId = compositionInterface.ftId;
        this.quantite = compositionInterface.quantite;
        this.cout = compositionInterface.cout;
        this.uniteId = compositionInterface.uniteId;
        this.article = compositionInterface.article;

        this.fichetechniqueCompositon = compositionInterface.fichetechniqueCompositon;
        this.unite = compositionInterface.unite;
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