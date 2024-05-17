import { BonCommande } from "./bonCommande";
import { IntefaceConditionnement } from "./inteface-conditionnements";
import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";

export interface InterfaceCommandeDetail{
    id?:number | undefined;
    commandeId:number;
    articlefournisseurId:number;
    conditionnementId:number;
    QteCommande: number;
    QteCommandeFT: number;
    prixarticle:number;
    remise:number;
    validationdetailbc:boolean;
    selected?:boolean;

    commande?:BonCommande;
    articlefournisseur?: InterfaceArticlefournisseurs,
    conditionnement?: IntefaceConditionnement,
}

export interface InterfaceCommandeDetails {
    commandeDetails: InterfaceCommandeDetail[];
}