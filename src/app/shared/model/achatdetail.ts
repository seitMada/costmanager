import { Achat } from "./achats";
import { InterfaceAchatDetail } from "./interface-achatdetail";
import { InterfaceAchat } from "./interface-achats";
import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";

export class AchatDetail implements InterfaceAchatDetail{
    id?: number | undefined;
    achatId:number;
    articlefournisseurId:number;
    quantite: number;
    prixArticle	:number;
    remise:number;
    valeurTva:number;
    selected?:boolean;

    achat:InterfaceAchat;
    articlefournisseur : InterfaceArticlefournisseurs;

    constructor(achatDetailInterface:InterfaceAchatDetail) {
        this.achatId = achatDetailInterface.achatId;
        this.articlefournisseurId = achatDetailInterface.articlefournisseurId;
        this.quantite =  achatDetailInterface.quantite;
        this.prixArticle = achatDetailInterface.prixArticle;
        this.remise = achatDetailInterface.remise;
        this.valeurTva = achatDetailInterface.valeurTva;
        this.achat = achatDetailInterface.achat;
        this.articlefournisseur  = achatDetailInterface.articlefournisseur
    }
}