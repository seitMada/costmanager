import { Adress } from "./adresse";
import { InterfaceAdresse, InterfaceAdresses } from "./interface-adresse";
import { InterfaceContact, InterfaceContacts, InterfaceOperateur, InterfaceOperateurs } from "./interface-operateur";

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
    adresseId: number | null;
    selected?: boolean;

    adresse: Adress;
    operateur: InterfaceOperateur[];
    // modereglement:
}

export interface InterfaceFournisseurs {
    fournisseurs: InterfaceFournisseur[];
}