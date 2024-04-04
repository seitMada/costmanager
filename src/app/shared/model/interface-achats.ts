import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceCentreRevenu } from './interface-centrerevenu';
import { InterfaceFournisseur } from "./interface-fournisseurs";
import { InterfaceBonCommande } from './interface-bonCommande';

export interface InterfaceAchat{
    id?:number;
    exploitationId:number;
    centreId:number;
    dateAchat:Date;
    nopiece:string;
    montantHt:number;
    montantTtc:number;
    montantTva:number;
    fournisseurId:number;
    commandeId:number;

    exploitation: InterfaceExploitations;
    centre:InterfaceCentreRevenu;
    fournisseur:InterfaceFournisseur;
    commande:InterfaceBonCommande
    // achatDetail
}

export interface InterfaceAchats{
    achats: InterfaceAchat[];
}