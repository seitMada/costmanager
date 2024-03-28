import { InterfaceFournisseur } from "./interfaceFournisseur";

export class Fournisseur implements InterfaceFournisseur{
    id?:                    number;
    raison_social:            string;
    codeFournisseur:          string;
    siret:                    string;
    codeNaf:                  string;
    tvaIntracom:            string;
    web:                    string;
    modereglementId:       number;
    actif:             number;
    commentaires: string;

    constructor(fournisseurIntrface: InterfaceFournisseur = {
        raison_social: "",
        codeFournisseur:  "",
        siret: "",
        codeNaf: "",
        tvaIntracom: "",
        web:"",
        actif: 1,
        modereglementId: 0,
        commentaires:""
    }){
        this.raison_social = fournisseurIntrface.raison_social;
        this.codeFournisseur = fournisseurIntrface.codeFournisseur;
        this.siret = fournisseurIntrface.siret;
        this.codeNaf = fournisseurIntrface.codeNaf;
        this.tvaIntracom = fournisseurIntrface.tvaIntracom;
        this.web =fournisseurIntrface.web;
        this.modereglementId =fournisseurIntrface.modereglementId;
        this.actif = fournisseurIntrface.actif;
        this.commentaires =fournisseurIntrface.commentaires;
    }
}