import { InterfaceGroupeanalytiques } from "./interface-groupeanalytiques";

export class Groupeanalytique implements InterfaceGroupeanalytiques {
    id?: number | undefined;
    code_groupe: string;
    groupe: string;
    actif: boolean;
    type: string;

    constructor(groupeanalytiqueInterface: InterfaceGroupeanalytiques = {
        code_groupe: '',
        groupe: '',
        actif: true,
        type: 'A',
    }) {
        this.code_groupe = groupeanalytiqueInterface.code_groupe;
        this.groupe = groupeanalytiqueInterface.groupe;
        this.actif = groupeanalytiqueInterface.actif;
        this.type = groupeanalytiqueInterface.type;
    }
}