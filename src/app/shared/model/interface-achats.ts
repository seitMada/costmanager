import { InterfaceExploitations } from "./interface-exploitations";


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

    exploitation: InterfaceExploitations;
    // centre;
    // fournisseur;
    // achatDetail
}

export interface InterfaceAchats{
    achats: InterfaceAchat[];
}