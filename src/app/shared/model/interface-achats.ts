import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceCentreRevenu } from './interface-centrerevenu';
import { InterfaceFournisseur } from "./interface-fournisseurs";

export interface InterfaceAchat{
    id?:number;
    dateAchat:Date;
    dateFacture:Date;
    dateLivraison:Date;
    numFacture:string;
    montantHt:number;
    montantTva:number;
    montantRemise:number;
    fournisseurId:number;
    exploitationId:number;
    centreId:number;

    exploitation: InterfaceExploitations;
    centre:InterfaceCentreRevenu;
    fournisseur:InterfaceFournisseur;
    // achatDetail
}
