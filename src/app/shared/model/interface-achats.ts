import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceCentreRevenu } from './interface-centrerevenu';
import { InterfaceFournisseur } from "./interface-fournisseurs";
import { InterfaceAchatDetail } from "./interface-achatdetail";

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
    selected:boolean;
    validation:boolean;

    exploitation: InterfaceExploitations;
    centre:InterfaceCentreRevenu;
    fournisseur:InterfaceFournisseur;
    achatDetail: InterfaceAchatDetail[]
}
