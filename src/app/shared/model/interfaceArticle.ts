export interface InterfaceArticle{
    id?:                    number;
    codeArticle:            string;
    libelle:                string;
    marqueArticle:          string;
    reference:              number;
    coeffAchatCommande:     number;
    coeffInventaireAchat:   number;
    dechet:                 number;
    modifAchatPrix:         number;
    modifPourcentage:       number;
    prixActuel:             number;
    prixPrecedent:          number;
    prixGlobal:             number;
    exportERP:              number;
    commentaire:            string;
    coeffPonderation:       number;
    uniteachatId:           number;
    uniteinventaireId:      number;
    unitecommandeId:        number;
    dateModif:              string;
    famillesId:             number;
    categoriesId:           number;
    actif:             number;
}