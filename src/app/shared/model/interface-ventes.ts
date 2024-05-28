import { IntefaceConditionnement } from "./inteface-conditionnements";
import { InterfaceArticle } from "./interface-articles";
import { InterfaceCentreRevenu } from "./interface-centrerevenu";
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceFichetechnique } from "./interface-fichetechnique";
import { InterfaceOperateur } from "./interface-operateur";
import { InterfaceUnite } from "./interface-unite";

export interface InterfaceVentes {
    id?: number;
    num_ticket: string;
    montantht: number;
    montantttc: number;
    date_vente: Date;
    operateurId?: number;
    caisseId?: number;
    centreId?: number;
    exploitationId?: number;
    selected?: boolean;

    operateur?: InterfaceOperateur;
    centre?: InterfaceCentreRevenu;
    exploitation?: InterfaceExploitations;

    ventedetail: InterfaceVentesDetails[];
}

export interface InterfaceVentesDetails {
    id?: number;
    fichetechniqueId: number;
    prixht: number;
    prixttc: number;
    quantite: number;
    tvaId?: number;
    venteId: number;
    selected?: boolean;

    fichetechnique: InterfaceFichetechnique;
    conditionnement?: IntefaceConditionnement;
}

export interface InterfaceVentesDetailsArticle {
    id?: number;
    fichetechniqueId: number;
    articleId: number;
    prixht: number;
    prixttc: number;
    quantite: number;
    tvaId?: number;
    venteId: number;
    selected?: boolean;
    
    article: InterfaceArticle;
    fichetechnique: InterfaceFichetechnique;
    conditionnement?: IntefaceConditionnement;
}

