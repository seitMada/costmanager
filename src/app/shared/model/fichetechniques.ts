import { InterfaceCategories } from "./interface-categories";
import { InterfaceExploitations } from "./interface-exploitations";
import { InterfaceFamilles } from "./interface-familles";
import { InterfaceFichetechnique } from "./interface-fichetechnique";
import { InterfaceUnite } from "./interface-unite";

export class Fichetechnique implements InterfaceFichetechnique {
    fichetechniques: InterfaceFichetechnique[];

    id?: number | undefined;
    libelle: string;
    categorieId: number;
    familleId: number;
    uniteId: number;
    prix: number;
    cout: number;
    image: string;

    exploitation: InterfaceExploitations[];
    categorie: InterfaceCategories;
    famille: InterfaceFamilles;
    unite: InterfaceUnite;

    constructor(fichetechniques: InterfaceFichetechnique[]){
        this.fichetechniques = fichetechniques;
    }

    *[Symbol.iterator]() {
        for (let fichetechnique of this.fichetechniques) {
            yield fichetechnique;
        }
    }
}