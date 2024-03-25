import { InterfaceUnite } from "./interface-unite";

export class Unite implements InterfaceUnite{
    id?:            number | undefined;
    libelle:        string;
    code:           string;
    abreviation:    string;
    actif:          boolean;

    constructor(uniteInterface: InterfaceUnite) {
        this.libelle = uniteInterface.libelle;
        this.code = uniteInterface.code;
        this.abreviation = uniteInterface.abreviation;
        this.actif = uniteInterface.actif;
    }
}