import { Fournisseur } from "./fournisseurs";
import { Conditionnement } from "./conditionnements";
import { IntefaceConditionnements, IntefaceConditionnement } from "./inteface-conditionnements";
import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";

export class Articlefournisseur implements InterfaceArticlefournisseurs {
    id?: number | undefined;
    articleId: number;
    fournisseurId: number;
    marque: string;
    prixReference: number;
    prixReferencePrecedent: number;
    commentaire: string;

    fournisseur: Fournisseur;
    conditionnement: IntefaceConditionnement[];

    constructor(articlefournisseurInterface: InterfaceArticlefournisseurs) {
        this.articleId = articlefournisseurInterface.articleId;
        this.fournisseurId = articlefournisseurInterface.fournisseurId;
        this.marque = articlefournisseurInterface.marque;
        this.prixReference = articlefournisseurInterface.prixReference;
        this.prixReferencePrecedent = articlefournisseurInterface.prixReferencePrecedent;
        this.commentaire = articlefournisseurInterface.commentaire;
        this.fournisseur = articlefournisseurInterface.fournisseur;
        this.conditionnement = articlefournisseurInterface.conditionnement;
    }
}