import { InterfaceUnite } from "./interface-unite";

export interface IntefaceConditionnement {
    id?: number,
    articleId: number,
    idUniteCommande: number,
    coefficientAchatCommande: number,
    idUniteAchat: number,
    coefficientInventaireAchat: number,
    iduniteInventaire: number,
    coefficientInventaire: number,
    idUniteFt: number,
    articlefournisseurId: number,
    prixAchat: number;
    selected?:boolean;

    uniteAchat: InterfaceUnite,
    uniteCommande: InterfaceUnite,
    uniteInventaire: InterfaceUnite,
    uniteFt: InterfaceUnite
}

export interface IntefaceConditionnements {
    conditionnements: IntefaceConditionnement[];
}
