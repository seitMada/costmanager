import { Fournisseur } from "./fournisseurs";
import { Conditionnement } from "./conditionnements";
import { IntefaceConditionnements, IntefaceConditionnement } from "./inteface-conditionnements";
import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";
import { InterfaceArticle } from "./interface-articles";
import { InterfaceFournisseur } from "./interface-fournisseurs";

export class Articlefournisseur implements InterfaceArticlefournisseurs {
    id?: number | undefined;
    articleId: number;
    fournisseurId: number;
    marque: string;
    prixReference: number;
    prixReferencePrecedent: number;
    commentaire: string;

    article: InterfaceArticle;
    fournisseur: InterfaceFournisseur;
    conditionnement: IntefaceConditionnement[];

    constructor(articlefournisseurInterface: InterfaceArticlefournisseurs) {
        this.articleId = articlefournisseurInterface.articleId;
        this.fournisseurId = articlefournisseurInterface.fournisseurId;
        this.marque = articlefournisseurInterface.marque;
        this.prixReference = articlefournisseurInterface.prixReference;
        this.prixReferencePrecedent = articlefournisseurInterface.prixReferencePrecedent;
        this.commentaire = articlefournisseurInterface.commentaire;
        this.article = articlefournisseurInterface.article;
        this.fournisseur = articlefournisseurInterface.fournisseur;
        this.conditionnement = articlefournisseurInterface.conditionnement;
    }
}