export interface InterfaceFournisseur {
    id?: number | undefined;
    raison_social: string;
    actif: boolean;
    codeFournisseur: string;
    siret: string;
    codeNaf: string;
    tvaIntracom: string;
    web: string;
    codeComptable: string;
    modereglementId: number;
    commentaires: string;
    adresse:string;
}

// export interface InterfaceFournisseurs {
//     fournisseurs: InterfaceFournisseur[];
// }