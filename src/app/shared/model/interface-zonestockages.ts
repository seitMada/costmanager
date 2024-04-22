import { InterfaceCentreRevenu } from "./interface-centrerevenu";
import { InterfaceLieustockages } from "./interface-lieustockages";

export interface InterfaceZonestockages {
    id?: number;
    zone: string;
    lieuId: number;
    selected?: boolean;

    lieu: InterfaceLieustockages;
    centre: InterfaceCentreRevenu[]
}
