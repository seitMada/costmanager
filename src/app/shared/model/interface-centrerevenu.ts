import { Adress } from "./adresse";
import { Exploitation } from './exploitations';

export interface InterfaceCentreRevenu {
    id?:number;
    code:string;
    libelle: string;
    exploitationsId:number;
    adressesId: number;
    email: string;
    telephone:string;

    exploitations:Exploitation;
    adresses:Adress

}

export interface InterfaceCentreRevenus{
    centrerevenus: InterfaceCentreRevenu[];
}