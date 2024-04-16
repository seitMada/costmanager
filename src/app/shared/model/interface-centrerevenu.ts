import { Adress } from "./adresse";
import { Exploitation } from './exploitations';
import { InterfaceExploitations } from "./interface-exploitations";

export interface InterfaceCentreRevenu {
    id?: number;
    code: string;
    libelle: string;
    exploitationsId: number;
    adressesId: number;
    email: string;
    telephone: string;

    exploitations: InterfaceExploitations;
    adresses: Adress

}

export interface InterfaceCentreRevenus {
    centrerevenus: InterfaceCentreRevenu[];
}