import { InterfaceFournisseur } from "./interface-fournisseurs";
import { IntefaceConditionnement } from "./inteface-conditionnements";
import { InterfaceArticle } from "./interface-articles";

export interface InterfaceArticlefournisseurs {
    id?: number,
    articleId: number,
    fournisseurId: number,
    marque: string,
    prixReference: number,
    prixReferencePrecedent: number,
    commentaire: string,
    selected?: boolean,

    article: InterfaceArticle,
    fournisseur: InterfaceFournisseur,
    conditionnement: IntefaceConditionnement[]
}
