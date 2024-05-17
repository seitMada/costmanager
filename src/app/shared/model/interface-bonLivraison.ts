import { Adress } from "./adresse";
import { InterfaceCentreRevenu } from "./interface-centrerevenu";
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceFournisseur } from "./interface-fournisseurs";
import { InterfaceLivraisonDetail } from "./interface-livraisondetail";

export interface InterfaceBonLivraisons{
    id?:number | undefined;
    numLivraison:string;
    dateCommande:Date;
    dateLivraison:Date;
    remise:number;
    montantHt:number;
    montantTva:number;
    validation:number;
    commentaire:string;
    adresseId:number;
    fournisseurId:number;
    exploitationId:number;
    centreId:number;
    selected:boolean;

    adresse:Adress;
    fournisseur:InterfaceFournisseur;
    exploitation:InterfaceExploitations;
    centre:InterfaceCentreRevenu;
    livraisonDetail:InterfaceLivraisonDetail[];
}