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

    
}
