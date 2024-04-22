
import { InterfaceCentreRevenu, InterfaceCentreRevenus } from './interface-centrerevenu';
import { Exploitation } from './exploitations';
import { Adress } from "./adresse";
import { InterfaceLieustockages } from './interface-lieustockages';


export class Centrerevenus implements InterfaceCentreRevenus {
    centrerevenus: InterfaceCentreRevenu[];

    constructor(centrerevenus: InterfaceCentreRevenu[]) {
        this.centrerevenus = centrerevenus;
    }

    *[Symbol.iterator]() {
        for (let centrerevenu of this.centrerevenus) {
            yield centrerevenu;
        }
    }
}

export class Centrerevenu implements InterfaceCentreRevenu {
    id?: number | undefined;
    code: string;
    libelle: string;
    exploitationsId: number;
    adressesId: number;
    email: string;
    telephone: string;

    exploitations: Exploitation;
    adresses: Adress;

    constructor(centreInterface: InterfaceCentreRevenu = {
        code: '',
        libelle: '',
        exploitationsId: 0,
        adressesId: 0,
        email: '',
        telephone: '',
        exploitations: new Exploitation(),
        adresses: new Adress(),
    }) {
        this.code = centreInterface.code;
        this.libelle = centreInterface.libelle;
        this.exploitationsId = centreInterface.exploitationsId;
        this.adressesId = centreInterface.adressesId;
        this.email = centreInterface.email;
        this.telephone = centreInterface.telephone;
        this.exploitations = centreInterface.exploitations;
        this.adresses = centreInterface.adresses;
    }
}