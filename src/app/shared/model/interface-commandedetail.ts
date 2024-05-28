import { BonCommande } from "./bonCommande";
import { IntefaceConditionnement } from "./inteface-conditionnements";
import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";
import { InterfaceArticle } from "./interface-articles";

export interface InterfaceCommandeDetail{
    id?:number | undefined;
    commandeId:number;
    articlefournisseurId:number;
    conditionnementId:number;
    articleId:number;
    QteCommande: number;
    QteCommandeFT: number;
    prixarticle:number;
    remise:number;
    validationdetailbc:boolean;
    selected?:boolean;

    commande?:BonCommande;
    articlefournisseur?: InterfaceArticlefournisseurs,
    conditionnement?: IntefaceConditionnement,
    article: InterfaceArticle;
}

export interface InterfaceCommandeDetails {
    commandeDetails: InterfaceCommandeDetail[];
}