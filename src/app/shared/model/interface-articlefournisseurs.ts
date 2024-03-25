import { InterfaceFournisseur } from "./interface-fournisseurs";
import { IntefaceConditionnement } from "./inteface-conditionnements";

export interface InterfaceArticlefournisseurs {
    id?: number,
    articleId: number,
    fournisseurId: number,
    marque: string,
    prixReference: number,
    prixReferencePrecedent: number,
    commentaire: string,

    fournisseur: InterfaceFournisseur,
    conditionnement: IntefaceConditionnement[]
}
