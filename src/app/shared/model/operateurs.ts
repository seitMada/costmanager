
import { environment } from '../../../environments/environment';
import { InterfaceOperateur } from "./interface-operateur";

export class Operateur implements InterfaceOperateur {
    id?: number | undefined;
    nom: string;
    prenom: string;
    email: string;
    mdp:  string;
    compteConnecte: boolean;
    actif: boolean;
    login_count: number;
    code: string;
    fournisseurId: number | null;
    telephone: string;
    civilite: string;
    selected?: boolean | undefined;
    
    exploitationId?: number;
    centreId?: number;

    constructor (operateurInterface: InterfaceOperateur = {
        nom: '',
        prenom: '',
        email: '',
        mdp: '123456789',
        compteConnecte: false,
        actif: true,
        login_count: 0,
        code: '',
        fournisseurId: null,
        exploitationId: 0,
        centreId: 0,
        telephone: '',
        civilite: '',
        selected: false
    }) {
        this.nom = operateurInterface.nom.toUpperCase();
        this.prenom = operateurInterface.prenom.charAt(0).toUpperCase + operateurInterface.prenom.slice(1);
        this.email = operateurInterface.email;
        this.mdp = operateurInterface.mdp;
        this.compteConnecte = operateurInterface.compteConnecte;
        this.actif = operateurInterface.actif;
        this.login_count = operateurInterface.login_count;
        this.code = operateurInterface.code;
        this.fournisseurId = operateurInterface.fournisseurId;
        this.telephone = operateurInterface.telephone;
        this.civilite = operateurInterface.civilite;
        this.selected = operateurInterface.selected;
    }
}