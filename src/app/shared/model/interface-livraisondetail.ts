import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";
import { InterfaceBonLivraisons }  from './interface-bonLivraison'

export interface InterfaceLivraisonDetails{
    id?:number | undefined;
    articlefournisseurId:number;
    livraisonId:number;
    quantiteCommandee:number;
    quantiteLivree:number;
    prixarticle:number;
    remise:number;
    valeurTva:number;

    articlefournisseur:InterfaceArticlefournisseurs;
    livraison: InterfaceBonLivraisons[]
}