import { Exploitation, Exploitations } from "./exploitations";
import { InterfaceAchat } from "./interface-achats";
import { InterfaceCentreRevenu } from "./interface-centrerevenu";
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceFournisseur } from "./interface-fournisseurs";
import { InterfaceCommandeDetails } from "./interface-commandedetail";

export interface InterfaceBonCommandes {
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
    commandeDetail:InterfaceCommandeDetails[];

    // unite: InterfaceUnite;
    achat: InterfaceAchat[];


}