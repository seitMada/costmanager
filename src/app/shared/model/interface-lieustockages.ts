import { InterfaceCentreRevenu } from "./interface-centrerevenu";
import { InterfaceZonestockages } from "./interface-zonestockages";

export interface InterfaceLieustockages {
    id?: number;
    lieu: string;
    centreId: number;
    selected?:boolean;

    centre: InterfaceCentreRevenu;
    zonestockage: InterfaceZonestockages[]
}
