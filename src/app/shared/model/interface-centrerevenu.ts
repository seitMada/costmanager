import { InterfaceAdresse } from "./interface-adresse";
import { InterfaceExploitations } from "./interface-exploitations";

export interface InterfaceCentreRevenu {
    id?:number;
    code:string;
    libelle: string;
    exploitationsId:number;
    adressesId: number;
    email: string;
    telephone:string;

    exploitations:InterfaceExploitations;
    adresses:InterfaceAdresse

}

export interface InterfaceCentreRevenus{
    centrerevenus: InterfaceCentreRevenu[];
}