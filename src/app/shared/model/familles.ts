import { InterfaceFamilles } from "./interface-familles";

export class Famille implements InterfaceFamilles {
  id?:            number | undefined;
  libelle:        string;
  code_couleur:   string;
  groupeId:       number;
  actif:          boolean;
  type:           string;

  constructor(familleInterface: InterfaceFamilles = {
    libelle:     '',
    code_couleur:'',
    groupeId:    0,
    actif:       true,
    type:        'A'
  }) {
    this.libelle=        familleInterface.libelle;
    this.code_couleur=   familleInterface.code_couleur;
    this.groupeId=       familleInterface.groupeId;
    this.actif=          familleInterface.actif;
    this.type=           familleInterface.type;
  }
}