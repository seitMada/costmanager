export interface InterfaceUnite {
    id?:            number;
    libelle:        string;
    code:           string;
    abreviation:    string;
    step:           number;
    actif:          boolean;
}

export interface InterfaceUnites {
    unites: InterfaceUnite[];
}
