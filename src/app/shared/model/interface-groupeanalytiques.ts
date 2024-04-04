export interface InterfaceGroupeanalytiques {
    id?:            number;
    code_groupe:    string;
    groupe:         string;
    actif:          boolean;
    type:           string;
}


export interface InterfaceGroupeanalytiquess {
    groupeanalytiques: InterfaceGroupeanalytiques[];
}