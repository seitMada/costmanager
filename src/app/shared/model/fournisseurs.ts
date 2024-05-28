import { Adress } from "./adresse";
import { InterfaceAdresse } from "./interface-adresse";
import { InterfaceFournisseur, InterfaceFournisseurs } from "./interface-fournisseurs";
import { InterfaceOperateur } from "./interface-operateur";


export class Fournisseur implements InterfaceFournisseurs {
  fournisseurs: InterfaceFournisseur[];

  constructor(fournisseurs: InterfaceFournisseur[]) {
    this.fournisseurs = fournisseurs;
  }

  *[Symbol.iterator]() {
    for (let fournisseur of this.fournisseurs) {
      yield fournisseur;
    }
  }
}

export class Fournisseurs implements InterfaceFournisseur {
  id?: number | undefined;
  raison_social: string;
  actif: boolean;
  codeFournisseur: string;
  siret: string;
  codeNaf: string;
  tvaIntracom: string;
  web: string;
  codeComptable: string;
  modereglementId: number;
  commentaires: string;
  selected?: boolean;
  adresse: Adress;
  adresseId: number | null;
  operateur: InterfaceOperateur[];
  flags?: string | undefined;

  constructor(fournisseurInterface: InterfaceFournisseur = {
    raison_social: '',
    actif: true,
    codeFournisseur: '',
    siret: '',
    codeNaf: '',
    tvaIntracom: '',
    web: '',
    codeComptable: '',
    modereglementId: 0,
    commentaires: '',
    selected: false,
    adresseId: null,
    adresse: new Adress(),
    operateur: [],
    flags: ''
  }) {
    this.raison_social = fournisseurInterface.raison_social;
    this.actif = fournisseurInterface.actif;
    this.codeFournisseur = fournisseurInterface.codeFournisseur;
    this.siret = fournisseurInterface.siret;
    this.codeNaf = fournisseurInterface.codeNaf;
    this.tvaIntracom = fournisseurInterface.tvaIntracom;
    this.web = fournisseurInterface.web;
    this.codeComptable = fournisseurInterface.codeComptable;
    this.modereglementId = 0;
    this.commentaires = fournisseurInterface.commentaires;
    this.selected = fournisseurInterface.selected;
    this.adresseId = fournisseurInterface.adresseId;
    this.adresse = fournisseurInterface.adresse;
    this.operateur = fournisseurInterface.operateur;
    this.flags = fournisseurInterface.flags;
  }
}