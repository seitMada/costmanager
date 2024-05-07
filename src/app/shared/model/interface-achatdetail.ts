import { Achat } from "./achats";
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

    achat:InterfaceAchat;
    articlefournisseur : InterfaceArticlefournisseurs;
}