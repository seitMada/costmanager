import { InterfaceBonCommande } from "./interface-bonCommande";
import { InterfaceAchat } from "./interface-achats";
import { InterfaceCentreRevenu } from "./interface-centrerevenu";
import { InterfaceFournisseur } from "./interface-fournisseurs";
import { InterfaceUnite } from "./interface-unite";

export class BonCommande implements InterfaceBonCommande {
  id?:            number | undefined;
  libelle:string;
  quantiteCommande:number;
  prixUnitaire:number;
  remise:number;
  montantHT:number;
  montantTva:number;
  noPiece:string;
  validation:boolean;
  commentaire:string;
  dateCommande:Date;
  fournisseurId:number;
  uniteId:number;
  centreId:number;
  fournisseur:InterfaceFournisseur;
  centre:InterfaceCentreRevenu;
  unite:InterfaceUnite;
  achat:InterfaceAchat[]

  // constructor(commandeInterface: InterfaceBonCommande = {
  //   libelle:'',
  //   quantiteCommande:0,
  //   prixUnitaire:0,
  //   remise:0,
  //   montantHT:0,
  //   montantTva:0,
  //   noPiece:'COM'+new Date(),
  //   validation:false,
  //   commentaire:'',
  //   dateCommande:new Date(),
  //   fournisseurId:0,
  //   uniteId:0,
  //   centreId:0,
    
  // }) {
  //   this.libelle=        commandeInterface.libelle;
  //   this.quantiteCommande=   commandeInterface.quantiteCommande;
  //   this.prixUnitaire=       commandeInterface.prixUnitaire;
  //   this.remise=          commandeInterface.remise;
  //   this.montantHT=           commandeInterface.montantHT;
  //   this.montantTva=        commandeInterface.montantTva;
  //   this.noPiece=   commandeInterface.noPiece;
  //   this.validation=       commandeInterface.validation;
  //   this.commentaire=          commandeInterface.commentaire;
  //   this.dateCommande=           commandeInterface.dateCommande;
  //   this.fournisseurId=   commandeInterface.fournisseurId;
  //   this.uniteId=       commandeInterface.uniteId;
  //   this.centreId=          commandeInterface.centreId;
  // }
}