import { InterfaceBonCommande, InterfaceBonCommandes } from "./interface-bonCommande";
import { InterfaceCentreRevenu } from "./interface-centrerevenu";
import { InterfaceFournisseur } from "./interface-fournisseurs";
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceCommandeDetail, InterfaceCommandeDetails } from "./interface-commandedetail"
import { Fournisseur, Fournisseurs } from "./fournisseurs";
import { Centrerevenu } from "./centrerevenu";
import { Exploitation } from "./exploitations";


export class BonCommandes implements InterfaceBonCommandes {
  boncommandes: InterfaceBonCommande[];

  constructor(boncommandes: InterfaceBonCommande[]) {
    this.boncommandes = boncommandes;
  }

  *[Symbol.iterator]() {
    for (let commande of this.boncommandes) {
      yield commande;
    }
  }
}
export class BonCommande implements InterfaceBonCommande {
  id?: number;
  remise: number;
  montantHT: number;
  montantTva: number;
  noPiece: string;
  validation: number;
  commentaire: string;
  dateCommande: Date;
  fournisseurId: number;
  exploitationId: number;
  selected: boolean;
  centreId: number;
  fournisseur: InterfaceFournisseur;
  centre: InterfaceCentreRevenu;
  exploitation: InterfaceExploitations;
  commandeDetail: InterfaceCommandeDetail[];

  constructor(bonCommandeInterface: InterfaceBonCommande) {
    this.id = bonCommandeInterface.id;
    this.remise = bonCommandeInterface.remise;
    this.montantHT = bonCommandeInterface.montantHT;
    this.montantTva = bonCommandeInterface.montantTva;
    this.noPiece = bonCommandeInterface.noPiece;
    this.validation = bonCommandeInterface.validation;
    this.commentaire = bonCommandeInterface.commentaire;
    this.dateCommande = bonCommandeInterface.dateCommande;
    this.fournisseurId = bonCommandeInterface.fournisseurId;
    this.exploitationId = bonCommandeInterface.exploitationId;
    this.centreId = bonCommandeInterface.centreId;
    this.fournisseur = bonCommandeInterface.fournisseur;
    this.centre = bonCommandeInterface.centre;
    this.exploitation = bonCommandeInterface.exploitation;
    this.commandeDetail = bonCommandeInterface.commandeDetail;
  }
}


