import { InterfaceLieustockages } from "./interface-lieustockages";

export interface InterfaceZonestockages {
    id?: number;
    zone: string;
    lieuId: number;

    lieu: InterfaceLieustockages;
}
