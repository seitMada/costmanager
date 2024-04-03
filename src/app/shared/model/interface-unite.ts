export interface InterfaceUnite {
    id?:            number;
    libelle:        string;
    code:           string;
    abreviation:    string;
    actif:          boolean;
}

export interface InterfaceUnites {
    unites: InterfaceUnite[];
}
