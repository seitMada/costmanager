
import { environment } from '../../../environments/environment';
import { InterfaceOperateur } from "./interfaceOperateur";

export class Operateur implements InterfaceOperateur {
    id?: number | undefined;
    nom: string;
    prenom: string;
    nomConnexion: string;
    email: string;
    mdp: string;
    connecter: number;
    actif: number;
    loginError: number;
    exploitationId: number;
    centreId: number;
    
    constructor (operateurInterface: InterfaceOperateur = {
        nom: '',
        prenom: '',
        nomConnexion: '',
        email: '',
        mdp: '123456',
        connecter: 0,
        actif: 0,
        loginError: 3,
        exploitationId: 1,
        centreId: 1,
    }) {
        this.nom = operateurInterface.nom.toUpperCase();
        this.prenom = operateurInterface.prenom.charAt(0).toUpperCase + operateurInterface.prenom.slice(1);
        this.nomConnexion = operateurInterface.nomConnexion.toLowerCase();
        this.email = operateurInterface.email;
        this.mdp = operateurInterface.mdp;
        this.connecter = operateurInterface.connecter;
        this.actif = operateurInterface.actif;
        this.loginError = operateurInterface.loginError;
        this.exploitationId = operateurInterface.exploitationId;
        this.centreId = operateurInterface.centreId;
    }
}