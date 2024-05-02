import { Achat } from "./achats";
import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";

export interface InterfaceAchatDetail{
    id?:number | undefined;
    achatId:number;
    articlefournisseurId:number;
    quantite: number;
    prixarticle:number;
    remise:number;
    valeurtva:number;
    selected?:boolean;

    achat?:Achat;
    articlefournisseur : InterfaceArticlefournisseurs
}