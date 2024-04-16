import { InterfaceUnite, InterfaceUnites } from "./interface-unite";

export class Unite implements InterfaceUnite{
    id?:            number | undefined;
    libelle:        string;
    code:           string;
    abreviation:    string;
    step: number;
    actif:          boolean;

    constructor(uniteInterface: InterfaceUnite) {
        this.libelle = uniteInterface.libelle;
        this.code = uniteInterface.code;
        this.abreviation = uniteInterface.abreviation;
        this.step = uniteInterface.step;
        this.actif = uniteInterface.actif;
    }
}

export class Unites implements InterfaceUnites{
    unites: InterfaceUnite[];

    constructor(unites: InterfaceUnite[]){
        this.unites = unites;
    }
  
    *[Symbol.iterator]() {
        for (let unite of this.unites) {
            yield unite;
        }
    }
}