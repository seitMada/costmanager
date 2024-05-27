import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";
import { InterfaceBonLivraisons }  from './interface-bonLivraison'
import { IntefaceConditionnement } from "./inteface-conditionnements";
import { InterfaceArticle } from "./interface-articles";

export interface InterfaceLivraisonDetail{
    id?:number | undefined;
    articlefournisseurId:number;
    articleId: number;
    livraisonId:number;
    quantiteCommandee:number;
    quantiteCommandeeFT:number;
    conditionnementId:number;
    quantiteFT:number;
    quantiteLivree:number;
    quantiteLivreeFT:number;
    prixarticle:number;
    remise:number;
    valeurTva:number;
    selected:boolean;

    articlefournisseur:InterfaceArticlefournisseurs;
    livraison: InterfaceBonLivraisons[]
    conditionnement: IntefaceConditionnement;
    article:InterfaceArticle;
}

export interface InterfaceLivraisonDetails{
    livraisonDetails: InterfaceLivraisonDetail[];
}