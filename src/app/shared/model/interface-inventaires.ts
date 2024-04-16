import { InterfaceArticle } from "./interface-articles";
import { InterfaceCentreRevenu } from "./interface-centrerevenu";
import { InterfaceOperateur } from "./interface-operateur";
import { InterfaceZonestockages } from "./interface-zonestockages";

export interface InterfaceInventaires {
    id?: number;
    date_inventaire: Date;
    commentaire: string;
    etat: boolean;
    zonestockageId: number;
    operateurId: number;
    centreRevenuId: number;
    selected?: boolean;

    centre: InterfaceCentreRevenu;
    operateur: InterfaceOperateur;
    zonestockage: InterfaceZonestockages;
    inventairedetail: InterfaceInventairesDetails[]
}

export interface InterfaceInventairesDetails {
    id?:number;
    articleId:number;
    quantite:number;
    uniteId:number;
    inventaireId:number;
    selected?: boolean;

    article: InterfaceArticle;
}
