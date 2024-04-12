import { InterfaceCentreRevenu } from "./interface-centrerevenu";
import { InterfaceOperateur } from "./interface-operateur";
import { InterfaceZonestockages } from "./interface-zonestockages";

export interface InterfaceInventaires {
    id?: number;
    date_inventaire: Date;
    commentaire: string;
    etat: boolean;
    zonestockageId: number;
    operateurId: number;
    centreRevenuId: number;

    centreRevenu: InterfaceCentreRevenu;
    operateur: InterfaceOperateur;
    zonestockage: InterfaceZonestockages;
}
