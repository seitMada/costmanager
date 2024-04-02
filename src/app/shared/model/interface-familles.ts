export interface InterfaceFamilles {
    id?:            number;
    libelle:        string;
    code_couleur:   string;
    groupeId:       number;
    actif:          boolean;
    type:           string;
}

export interface InterfaceFamilless {
    familles: InterfaceFamilles[]
}