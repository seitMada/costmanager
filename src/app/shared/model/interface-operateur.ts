export interface InterfaceOperateur {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
    mdp:  string;
    compteConnecte: boolean;
    actif: boolean;
    login_count: number;
    code: string;
    fournisseurId: number | null;
    exploitationId?: number;
    centreId?: number;
    telephone: string;
    civilite: string;
    selected?:boolean;
    isAdmin?: boolean;
}

export interface InterfaceOperateurs {
    operateurs: InterfaceOperateur[];
}

export interface InterfaceContact {
    id?: number;
    telephone: string;
    fournisseurId: number;

    operateurs: InterfaceOperateurs;
}

export interface InterfaceContacts {
    contacts: InterfaceContact[];
}