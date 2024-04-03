export interface InterfaceAllergenes {
    id?:        number;
    libelle:    string;
    selected?:  boolean;
}


export interface InterfaceAllergeneArticle {
    id?:                number;
    articleId:          number;
    allergeneId:        number;

    allergene:          InterfaceAllergenes;
}