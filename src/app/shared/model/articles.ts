import { InterfaceArticle } from "./interfaceArticle";

export class Article implements InterfaceArticle{
    id?:                    number | undefined;
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

    constructor(articleInterface: InterfaceArticle = {
        codeArticle: "",
        libelle:  "",
        marqueArticle: "",
        reference: 0,
        coeffAchatCommande: 0,
        coeffInventaireAchat:0,
        dechet: 0,
        modifAchatPrix: 0,
        modifPourcentage:0,
        prixActuel: 0,
        prixPrecedent:0,
        prixGlobal: 0,
        exportERP: 0,
        commentaire: "",
        coeffPonderation:0,
        uniteachatId: 1,
        uniteinventaireId:1,
        unitecommandeId: 1,
        dateModif:  "",
        famillesId: 1,
        categoriesId: 1,
        actif: 1,
    }){
        this.codeArticle = articleInterface.codeArticle;
        this.libelle = articleInterface.libelle;
        this.marqueArticle = articleInterface.marqueArticle;
        this.reference = articleInterface.reference;
        this.coeffAchatCommande = articleInterface.coeffAchatCommande;
        this.coeffInventaireAchat =articleInterface.coeffInventaireAchat;
        this.dechet =articleInterface.dechet;
        this.modifAchatPrix = articleInterface.modifAchatPrix;
        this.modifPourcentage =articleInterface.modifPourcentage;
        this.prixActuel = articleInterface.prixActuel;
        this.prixPrecedent = articleInterface.prixPrecedent;
        this.prixGlobal =articleInterface.prixGlobal;
        this.exportERP = articleInterface.exportERP;
        this.commentaire =articleInterface.commentaire;
        this.coeffPonderation = articleInterface.coeffPonderation;
        this.uniteachatId = articleInterface.uniteachatId
        this.uniteinventaireId =articleInterface.uniteinventaireId;
        this.unitecommandeId = articleInterface.unitecommandeId;
        this.dateModif = articleInterface.dateModif;
        this.famillesId = articleInterface.famillesId;
        this.categoriesId = articleInterface.categoriesId;
        this.actif = articleInterface.actif;
    }
}