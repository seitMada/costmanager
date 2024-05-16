import { Articlefournisseur } from "./articlefournisseurs";
import { BonCommande, BonCommandes } from "./bonCommande";
import { Conditionnement } from "./conditionnements";
import { IntefaceConditionnement } from "./inteface-conditionnements";
import { InterfaceArticlefournisseurs } from "./interface-articlefournisseurs";
import { InterfaceCommandeDetail, InterfaceCommandeDetails } from "./interface-commandedetail";

export class CommandeDetail implements InterfaceCommandeDetail {
  id?: number | undefined;
  commandeId: number;
  articlefournisseurId: number;
  conditionnementId: number;
  QteCommande: number;
  QteCommandeFT: number;
  prixarticle: number;
  remise: number;
  validationdetailbc: boolean;

  commande?: BonCommande;
  articlefournisseur?: InterfaceArticlefournisseurs;
  conditionnement?: IntefaceConditionnement;

  constructor(commandeDetailInterface: InterfaceCommandeDetail) {
    this.commandeId = commandeDetailInterface.commandeId;
    this.articlefournisseurId = commandeDetailInterface.articlefournisseurId;
    this.conditionnementId = commandeDetailInterface.conditionnementId;
    this.QteCommande = commandeDetailInterface.QteCommande;
    this.QteCommandeFT = commandeDetailInterface.QteCommandeFT;
    this.prixarticle = commandeDetailInterface.prixarticle;
    this.remise = commandeDetailInterface.remise;
    this.validationdetailbc = commandeDetailInterface.validationdetailbc;
    this.commande = commandeDetailInterface.commande;
    this.articlefournisseur = commandeDetailInterface.articlefournisseur;
    this.conditionnement = commandeDetailInterface.conditionnement;
  }
}

export class CommandeDetails implements InterfaceCommandeDetails {
  commandeDetails: InterfaceCommandeDetail[];

  constructor(commandeDetails: InterfaceCommandeDetail[]) {
    this.commandeDetails = commandeDetails;
  }

  *[Symbol.iterator]() {
    for (let commandeDetail of this.commandeDetails) {
      yield commandeDetail;
    }
  }
}