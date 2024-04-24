import { InterfaceBonCommandes } from "./interface-bonCommande";
import { InterfaceAchat } from "./interface-achats";
import { InterfaceCentreRevenu } from "./interface-centrerevenu";
import { InterfaceFournisseur } from "./interface-fournisseurs";
import { InterfaceUnite } from "./interface-unite";
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceCommandeDetails } from "./interface-commandedetail";

export class BonCommande implements InterfaceBonCommandes {
  id?:            number | undefined;
  remise: number;
  montantHT: number;
  montantTva: number;
  noPiece: string;
  validation: boolean;
  commentaire: string;
  dateCommande: Date;
  fournisseurId: number;
  exploitationId: number;
  selected: false;
  centreId: number;
  fournisseur: InterfaceFournisseur;
  centre: InterfaceCentreRevenu;
  exploitation: InterfaceExploitations;
  commandeDetail:InterfaceCommandeDetails[];

  achat: InterfaceAchat[];

    constructor(bonCommandeInterface:InterfaceBonCommandes){
      this.remise=bonCommandeInterface.remise;
      this.montantHT=bonCommandeInterface.montantHT;
      this.montantTva=bonCommandeInterface.montantTva;
      this.noPiece=bonCommandeInterface.noPiece;
      this.validation=bonCommandeInterface.validation;
      this.commentaire=bonCommandeInterface.commentaire;
      this.dateCommande=bonCommandeInterface.dateCommande;
      this.fournisseurId=bonCommandeInterface.fournisseurId;
      this.centreId=bonCommandeInterface.centreId;
      this.fournisseur=bonCommandeInterface.fournisseur;
      this.centre=bonCommandeInterface.centre;
      this.achat=bonCommandeInterface.achat;
      this.commandeDetail = bonCommandeInterface.commandeDetail;
    }
}
