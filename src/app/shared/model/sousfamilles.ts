import { InterfaceSousfamilles } from "./interface-sousfamilles";

export class SousFamille implements InterfaceSousfamilles {
    id?: number | undefined;
    code: string;
    libelle: string;
    famillesId: number;

    constructor(sousfamilleInterface: InterfaceSousfamilles = {
        libelle: '',
        code: '',
        famillesId: 0,
    }) {
        this.libelle = sousfamilleInterface.libelle;
        this.code = sousfamilleInterface.code;
        this.famillesId = sousfamilleInterface.famillesId;
    }
}