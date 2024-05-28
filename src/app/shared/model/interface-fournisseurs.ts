import { Adress } from "./adresse";
import { IntefaceConditionnement } from "./inteface-conditionnements";
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
    flags?: string;

    adresse: Adress;
    operateur: InterfaceOperateur[];
    conditionnement?: IntefaceConditionnement[];
    // modereglement:
}

export interface InterfaceFournisseurs {
    fournisseurs: InterfaceFournisseur[];
}