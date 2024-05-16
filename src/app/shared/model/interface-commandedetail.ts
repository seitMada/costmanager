import { Articlefournisseur } from "./articlefournisseurs";
import { BonCommande } from "./bonCommande";
import { Conditionnement } from "./conditionnements";
import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";
import { InterfaceBonCommandes } from "./interface-bonCommande";

export interface InterfaceCommandeDetail{
    id?:number | undefined;
    commandeId:number;
    articlefournisseurId:number;
    conditionnementId:number;
    QteCommande: number;
    prixarticle:number;
    remise:number;
    validationdetailbc:boolean;
    selected?:boolean;

    commande?:BonCommande;
    articlefournisseur?: InterfaceArticlefournisseurs,
    conditionnement?: Conditionnement,
}

export interface InterfaceCommandeDetails {
    commandeDetails: InterfaceCommandeDetail[];
}