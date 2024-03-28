export interface InterfaceBonCommande {
    id?:            number | undefined;
    libelle:string;
    quantiteCommande:number;
    prixUnitaire:number;
    remise:number;
    montantHT:number;
    montantTva:number;
    noPiece:string;
    validation:boolean;
    commentaire:string;
    dateCommande:Date;
    dateLivraison:Date;
    fournisseurId:number;
    uniteId:number;
    centreId:number;
}
