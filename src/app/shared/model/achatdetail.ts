import { Achat } from "./achats";
import { IntefaceConditionnement } from "./inteface-conditionnements";
import { InterfaceAchatDetail } from "./interface-achatdetail";
import { InterfaceAchat } from "./interface-achats";
import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";
import { InterfaceArticle } from "./interface-articles";

export class AchatDetail implements InterfaceAchatDetail{
    id?: number | undefined;
    achatId:number;
    articlefournisseurId:number;
    articleId:number;
    quantite: number;
    prixArticle	:number;
    conditionnementId:number;
    qteFTAchat:number;
    remise:number;
    valeurTva:number;
    selected?:boolean;

    achat:InterfaceAchat;
    articlefournisseur : InterfaceArticlefournisseurs;
    conditionnement: IntefaceConditionnement;
    article:InterfaceArticle;

    constructor(achatDetailInterface:InterfaceAchatDetail) {
        this.achatId = achatDetailInterface.achatId;
        this.articlefournisseurId = achatDetailInterface.articlefournisseurId;
        this.articleId = achatDetailInterface.articleId;
        this.quantite =  achatDetailInterface.quantite;
        this.qteFTAchat = achatDetailInterface.qteFTAchat;
        this.prixArticle = achatDetailInterface.prixArticle;
        this.remise = achatDetailInterface.remise;
        this.valeurTva = achatDetailInterface.valeurTva;
        this.achat = achatDetailInterface.achat;
        this.articlefournisseur  = achatDetailInterface.articlefournisseur;
        this.conditionnement  = achatDetailInterface.conditionnement;
        this.article = achatDetailInterface.article;
    }
}