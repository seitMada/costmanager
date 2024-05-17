import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";
import { InterfaceBonLivraisons }  from './interface-bonLivraison'
import { IntefaceConditionnement } from "./inteface-conditionnements";

export interface InterfaceLivraisonDetail{
    id?:number | undefined;
    articlefournisseurId:number;
    livraisonId:number;
    quantiteCommandee:number;
    conditionnementId:number;
    quantiteFT:number;
    quantiteLivree:number;
    prixarticle:number;
    remise:number;
    valeurTva:number;
    selected:boolean;

    articlefournisseur:InterfaceArticlefournisseurs;
    livraison: InterfaceBonLivraisons[]
    conditionnement: IntefaceConditionnement;
}

export interface InterfaceLivraisonDetails{
    livraisonDetails: InterfaceLivraisonDetail[];
}