import { InterfaceBonCommande } from "./interface-bonCommande";

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
  dateLivraison:Date;
  fournisseurId:number;
  uniteId:number;
  centreId:number;

  constructor(commandeInterface: InterfaceBonCommande = {
    libelle:'',
    quantiteCommande:0,
    prixUnitaire:0,
    remise:0,
    montantHT:0,
    montantTva:0,
    noPiece:'',
    validation:false,
    commentaire:'',
    dateCommande: new Date(),
    dateLivraison: new Date(),
    fournisseurId:0,
    uniteId:0,
    centreId:0,
  }) {
    this.libelle=        commandeInterface.libelle;
    this.quantiteCommande=   commandeInterface.quantiteCommande;
    this.prixUnitaire=       commandeInterface.prixUnitaire;
    this.remise=          commandeInterface.remise;
    this.montantHT=           commandeInterface.montantHT;
    this.montantTva=        commandeInterface.montantTva;
    this.noPiece=   commandeInterface.noPiece;
    this.validation=       commandeInterface.validation;
    this.commentaire=          commandeInterface.commentaire;
    this.dateCommande=           commandeInterface.dateCommande;
    this.dateLivraison=        commandeInterface.dateLivraison;
    this.fournisseurId=   commandeInterface.fournisseurId;
    this.uniteId=       commandeInterface.uniteId;
    this.centreId=          commandeInterface.centreId;
  }
}

// export { InterfaceBonCommande };
