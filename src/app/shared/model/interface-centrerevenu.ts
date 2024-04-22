import { Adress } from "./adresse";
import { Exploitation } from './exploitations';
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceLieustockages } from "./interface-lieustockages";

export interface InterfaceCentreRevenu {
    id?: number;
    code: string;
    libelle: string;
    exploitationsId: number;
    adressesId: number;
    email: string;
    telephone: string;

    exploitations: Exploitation;
    adresses: Adress;
}

export interface InterfaceCentreRevenus {
    centrerevenus: InterfaceCentreRevenu[];
}