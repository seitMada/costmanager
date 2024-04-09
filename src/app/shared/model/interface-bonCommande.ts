import { Exploitation, Exploitations } from "./exploitations";
import { InterfaceAchat } from "./interface-achats";
import { InterfaceCentreRevenu } from "./interface-centrerevenu";
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceFournisseur } from "./interface-fournisseurs";
import { InterfaceUnite } from "./interface-unite";

export interface InterfaceBonCommande {
    id?: number | undefined;
    libelle: string;
    quantiteCommande: number;
    remise: number;
    montantHT: number;
    montantTva: number;
    noPiece: string;
    validation: boolean;
    commentaire: string;
    dateCommande: Date;
    fournisseurId: number;
    exploitationId: number;
    centreId: number;

    fournisseur: InterfaceFournisseur;
    centre: InterfaceCentreRevenu[];
    exploitation: InterfaceExploitations[];
    // unite: InterfaceUnite;
    achat: InterfaceAchat[];


}

export interface InterfaceBonCommandes {
    boncommandes: InterfaceBonCommande[];
}
