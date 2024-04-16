import { InterfaceCentreRevenu } from "./interface-centrerevenu";

export interface InterfaceLieustockages {
    id?: number;
    lieu: string;
    centreId: number;

    centreRevenu: InterfaceCentreRevenu
}
