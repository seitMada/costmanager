export interface InterfaceOperateur {
    id?:                number,
    nom:                string,
    prenom:             string,
    email:              string,
    mdp:                string,
    connecter:          number,
    actif:              number,
    loginError:         number,
    exploitationId:     number,
    centreId:           number
}