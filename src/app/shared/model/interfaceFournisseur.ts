export interface InterfaceFournisseur{
    id?:                    number;
    raison_social:            string;
    codeFournisseur:          string;
    siret:                    string;
    codeNaf:                  string;
    tvaIntracom:            string;
    web:                    string;
    modereglementId:       number;
    actif:             number;
    commentaires: string;
}