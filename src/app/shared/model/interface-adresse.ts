import { InterfaceCentreRevenu } from "./interface-centrerevenu";
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceOperateur } from "./interface-operateur";

export interface InterfaceAdresse{
    id?:number;
    rue:string;
    ville:string;
    code_postal:number;
    pays:string;

    centreRevenu: InterfaceCentreRevenu[];
    exploitation:InterfaceExploitations[];
    operateur: InterfaceOperateur[];
}

export interface InterfaceAdresses{
    adresses:InterfaceAdresse[];
}