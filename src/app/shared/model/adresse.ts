import { InterfaceAdresse, InterfaceAdresses } from './interface-adresse';
import { InterfaceCentreRevenu } from './interface-centrerevenu';
import { InterfaceExploitations } from './interface-exploitations';
import { InterfaceOperateur } from './interface-operateur';

export class Adresse implements InterfaceAdresses {
    adresses: InterfaceAdresse[];

    constructor(adresses: InterfaceAdresse[]) {
        this.adresses = adresses;
    }

    *[Symbol.iterator]() {
        for (let adresse of this.adresses) {
            yield adresse;
        }
    }
}

export class Adress implements InterfaceAdresse {
    id?: number | undefined;
    rue: string;
    ville: string;
    code_postal: string | null;
    pays: string;
    selected?: boolean;

    centreRevenu: InterfaceCentreRevenu[];
    exploitation: InterfaceExploitations[];
    operateur: InterfaceOperateur[];

    constructor(adresseInterface: InterfaceAdresse = {
        rue: '',
        ville: '',
        code_postal: null,
        pays: '',
        selected: false,
        centreRevenu: [],
        exploitation: [],
        operateur: []
    }) {
        if (adresseInterface) {
            this.rue = adresseInterface.rue;
            this.ville = adresseInterface.ville;
            this.code_postal = adresseInterface.code_postal;
            this.pays = adresseInterface.pays;
            this.selected = adresseInterface.selected;
            this.centreRevenu = adresseInterface.centreRevenu;
            this.exploitation = adresseInterface.exploitation;
            this.operateur = adresseInterface.operateur;
        } else {
            this.rue = '';
            this.ville = '';
            this.code_postal = '';
            this.pays = '';
            this.selected = false;
            this.centreRevenu = [];
            this.exploitation = [];
            this.operateur = [];
        }
    }
}