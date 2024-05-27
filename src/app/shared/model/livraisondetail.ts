import { InterfaceLivraisonDetail, InterfaceLivraisonDetails } from './interface-livraisondetail';
import { IntefaceConditionnement } from "./inteface-conditionnements";
import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";
import { InterfaceBonLivraisons } from './interface-bonLivraison';
import { InterfaceArticle } from './interface-articles';


export class LivraisonDetails implements InterfaceLivraisonDetails{
    livraisonDetails: InterfaceLivraisonDetail[];

    constructor(livraisonDetails:InterfaceLivraisonDetail[]) {
        this;livraisonDetails = livraisonDetails;
    }

    *[Symbol.iterator](){
        for(let livraisondetail of this.livraisonDetails){
            yield livraisondetail;
        }
    }
}

export class LivraisonDetail implements InterfaceLivraisonDetail{
    id?:number | undefined;
    articlefournisseurId:number;
    livraisonId:number;
    articleId:number;
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
    article: InterfaceArticle;

    constructor(livraisonDetail:InterfaceLivraisonDetail) {
        this.articlefournisseurId = livraisonDetail.articlefournisseurId;
        this.livraisonId = livraisonDetail.livraisonId;
        this.articleId = livraisonDetail.articleId;
        this.quantiteCommandee = livraisonDetail.quantiteCommandee;
        this.quantiteCommandeeFT = livraisonDetail.quantiteCommandeeFT;
        this.conditionnementId = livraisonDetail.conditionnementId;
        this.quantiteFT = livraisonDetail.quantiteFT;
        this.quantiteLivree = livraisonDetail.quantiteLivree;
        this.quantiteLivreeFT = livraisonDetail.quantiteLivreeFT;
        this.prixarticle = livraisonDetail.prixarticle;
        this.remise = livraisonDetail.remise;
        this.valeurTva = livraisonDetail.valeurTva;
        this.selected= livraisonDetail.selected;
        this.articlefournisseur= livraisonDetail.articlefournisseur;
        this.livraison= livraisonDetail.livraison;
        this.conditionnement= livraisonDetail.conditionnement;
        this.article = livraisonDetail.article;
    }
}

