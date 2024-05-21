import { Achat } from "./achats";
import { IntefaceConditionnement } from "./inteface-conditionnements";
import { InterfaceAchat } from "./interface-achats";
import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";

export interface InterfaceAchatDetail{
    id?:number | undefined;
    achatId:number;
    articlefournisseurId:number;
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
}