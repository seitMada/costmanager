export interface InterfaceAllergenes {
    id?:        number;
    libelle:    string;
}


export interface InterfaceAllergeneArticle {
    id?:                number;
    articleId:          number;
    allergeneId:        number;

    allergene:          InterfaceAllergenes;
}