export interface InterfaceCategories {
    id?:        number;
    code:       string;
    libelle:    string;
    actif:      boolean;
}

export interface InterfaceCategoriess {
    categories: InterfaceCategories[]
}