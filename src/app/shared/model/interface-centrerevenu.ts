import { Adress } from "./adresse";
import { Centrerevenus } from "./centrerevenu";
import { Exploitation } from './exploitations';
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceLieustockages } from "./interface-lieustockages";

export interface InterfaceCentreRevenu {
    selected?: any;
    id?: number;
    code: string;
    libelle: string;
    exploitationsId: number;
    adressesId: number;
    email: string;
    telephone: string;

    exploitations: Exploitation;
    adresses: Adress;
    lieuStockage: InterfaceLieustockages[];
}

export interface InterfaceCentreRevenus {
    centrerevenus: InterfaceCentreRevenu[];
}