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
    adresseId: number;
    contactId: number;
    exploitationId: number;
    centreId: number;
}