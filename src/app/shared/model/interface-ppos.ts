import { InterfaceOperateur } from "./interface-operateur";
import { InterfaceCentreRevenu } from "./interface-centrerevenu";
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceArticle } from "./interface-articles";
import { InterfaceFichetechnique } from "./interface-fichetechnique";
import { InterfaceUnite } from "./interface-unite";
import { IntefaceConditionnement } from "./inteface-conditionnements";

export interface InterfacePpos {
    id?: number;
    date_ppo: Date;
    operateurId: number;
    centreId: number;
    exploitationId: number;
    selected?: boolean;

    operateur: InterfaceOperateur;
    centre: InterfaceCentreRevenu;
    exploitation: InterfaceExploitations;

    ppodetail: InterfacePpoDetail[];
}

export interface InterfacePpoDetail {
    id?: number;
    ppoId?: number;
    articleId: number | null;
    fichetechniqueId: number | null;
    quantite: number;
    cout: number;
    uniteId:number;
    selected?: boolean;

    article: InterfaceArticle;
    unite: InterfaceUnite;
    fichetechnique: InterfaceFichetechnique;
    conditionnement?: IntefaceConditionnement;
    // ppo?: InterfacePpos;
}
