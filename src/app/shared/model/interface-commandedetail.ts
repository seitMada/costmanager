import { Articlefournisseur } from "./articlefournisseurs";
import { BonCommande } from "./bonCommande";
import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";

export interface InterfaceCommandeDetails{
    id?:number | undefined;
    commandeId:number;
    // composantId:number;
    articlefournisseurId:number;
    QteCommande: number;
    QteLivre:number;
    prixarticle:number;
    remise:number;
    validationdetailbc:boolean;
    selected:false;

    commande?:BonCommande;
    articlefournisseur : InterfaceArticlefournisseurs
}