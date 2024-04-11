import { Articlefournisseur } from "./articlefournisseurs";
import { BonCommande } from "./bonCommande";

export interface InterfaceCommandeDetails{
    id?:number | undefined;
    commandeId:number;
    composantId:number;
    articlefournisseurId:number;
    QteCommande: number;
    QteLivre:number;
    prixarticle:number;
    remise:number;
    validationdetailbc:boolean;

    commande:BonCommande;
    articlefournisseur:Articlefournisseur
}