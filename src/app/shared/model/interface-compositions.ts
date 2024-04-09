import { InterfaceArticle } from "./interface-articles";
import { InterfaceFichetechnique } from "./interface-fichetechnique";
import { InterfaceUnite } from "./interface-unite";

export interface InterfaceComposition {
    id?: number | undefined;
    fichetechniqueId: number;
    articleId: number | null;
    ftId: number | null;
    quantite: number;
    uniteId: number;
    cout: number;

    article: InterfaceArticle | null;
    // fichetechnique: InterfaceFichetechnique;
    fichetechniqueCompositon: InterfaceFichetechnique | null;
    unite: InterfaceUnite;
}

export interface InterfaceCompositions {
    compositions: InterfaceComposition[];
}
