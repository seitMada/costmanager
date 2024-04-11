import { Articlefournisseur } from "./articlefournisseurs";
import { BonCommande } from "./bonCommande";
import { InterfaceCommandeDetails } from "./interface-commandedetail";

export class CommandeDetail{
    id?:number | undefined;
    commandeId:number;
    articlefournisseurId:number;
    QteCommande: number;
    QteLivre:number;
    prixarticle:number;
    remise:number;
    validationdetailbc:boolean;

    commande:BonCommande;
    articlefournisseur:Articlefournisseur;
    

    constructor(commandeDetailInterface:InterfaceCommandeDetails) {
        this.commandeId= commandeDetailInterface.commandeId;
        this.articlefournisseurId= commandeDetailInterface.articlefournisseurId;
        this.QteCommande=  commandeDetailInterface.QteCommande;
        this.QteLivre= commandeDetailInterface.QteLivre;
        this.prixarticle= commandeDetailInterface.prixarticle;
        this.remise= commandeDetailInterface.remise;
        this.validationdetailbc= commandeDetailInterface.validationdetailbc;
    }
}