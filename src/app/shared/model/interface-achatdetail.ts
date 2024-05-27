import { Achat } from "./achats";
import { IntefaceConditionnement } from "./inteface-conditionnements";
import { InterfaceAchat } from "./interface-achats";
import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";
import { InterfaceArticle } from "./interface-articles";

export interface InterfaceAchatDetail{
    id?:number | undefined;
    achatId:number;
    articlefournisseurId:number;
    articleId: number;
    quantite: number;
    prixArticle	:number;
    remise:number;
    valeurTva:number;
    selected?:boolean;
    conditionnementId:number;
    qteFTAchat:number;

    achat:InterfaceAchat;
    articlefournisseur : InterfaceArticlefournisseurs;
    conditionnement : IntefaceConditionnement;
    article: InterfaceArticle;
}