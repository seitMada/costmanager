import { Exploitation, Exploitations } from "./exploitations";
import { InterfaceAchat } from "./interface-achats";
import { InterfaceCentreRevenu } from "./interface-centrerevenu";
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceFournisseur } from "./interface-fournisseurs";
import { InterfaceCommandeDetail, InterfaceCommandeDetails } from "./interface-commandedetail";

export interface InterfaceBonCommande {
    id?: number | undefined;
    remise: number;
    montantHT: number;
    montantTva: number;
    noPiece: string;
    validation: number;
    commentaire: string;
    dateCommande: Date;
    fournisseurId: number;
    exploitationId: number;
    centreId: number;
    selected?:boolean,

    fournisseur: InterfaceFournisseur;
    centre: InterfaceCentreRevenu;
    exploitation: InterfaceExploitations;
    commandeDetail:InterfaceCommandeDetails;

}

export interface InterfaceBonCommandes {
    boncommandes: InterfaceBonCommande[];
}