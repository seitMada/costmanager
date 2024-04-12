import { InterfaceLieustockages } from "./interface-lieustockages";

export interface InterfaceZonestockages {
    id?:number;
    zone:string;
    lieuId:number;

    lieustockage: InterfaceLieustockages;
}
