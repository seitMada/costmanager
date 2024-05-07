import { Adress } from "./adresse";
import { InterfaceBonLivraisons } from "./interface-bonLivraison";
import { InterfaceCentreRevenu } from "./interface-centrerevenu";
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceFournisseur } from "./interface-fournisseurs";
import { InterfaceLivraisonDetails } from "./interface-livraisondetail";

export class BonLivraison implements InterfaceBonLivraisons{
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
    livraisonDetail:InterfaceLivraisonDetails[]

    constructor(bonLivraisonInterface:InterfaceBonLivraisons) {
        this.numLivraison= bonLivraisonInterface.numLivraison;
        this.dateCommande= bonLivraisonInterface.dateCommande;
        this.dateLivraison= bonLivraisonInterface.dateLivraison;
        this.remise= bonLivraisonInterface.remise;
        this.montantHt= bonLivraisonInterface.montantHt;
        this.montantTva= bonLivraisonInterface.montantHt;
        this.validation= bonLivraisonInterface.validation;
        this.commentaire= bonLivraisonInterface.commentaire;
        this.adresseId= bonLivraisonInterface.adresseId;
        this.fournisseurId= bonLivraisonInterface.fournisseurId;
        this.exploitationId= bonLivraisonInterface.exploitationId;
        this.centreId= bonLivraisonInterface.centreId;
        this.adresse= bonLivraisonInterface.adresse;
        this.fournisseur= bonLivraisonInterface.fournisseur;
        this.exploitation= bonLivraisonInterface.exploitation;
        this.centre= bonLivraisonInterface.centre;
        this.livraisonDetail = bonLivraisonInterface.livraisonDetail;
    }
}