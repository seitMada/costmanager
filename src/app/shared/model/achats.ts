import { InterfaceAchat } from "./interface-achats";
import { InterfaceCentreRevenu } from "./interface-centrerevenu";
import { InterfaceFournisseur } from "./interface-fournisseurs";
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceAchatDetail } from "./interface-achatdetail";

export class Achat implements InterfaceAchat {
  id?:  number | undefined;
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
  achatDetail: InterfaceAchatDetail[];

  constructor(achatInterface:InterfaceAchat){
    this.dateAchat = achatInterface.dateAchat;
    this.dateFacture = achatInterface.dateFacture;
    this.dateLivraison = achatInterface.dateLivraison;
    this.numFacture = achatInterface.numFacture;
    this.montantHt = achatInterface.montantHt;
    this.montantTva = achatInterface.montantTva;
    this.montantRemise = achatInterface.montantRemise;
    this.fournisseurId = achatInterface.fournisseurId;
    this.exploitationId = achatInterface.exploitationId;
    this.centreId = achatInterface.centreId;
    this.exploitation =  achatInterface.exploitation;
    this.centre = achatInterface.centre;
    this.fournisseur = achatInterface.fournisseur;
    this.achatDetail = achatInterface.achatDetail;
    this.validation = achatInterface.validation;
  }
}
