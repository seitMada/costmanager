const endPoint = 'http://localhost:3000/';

export const environment = {
    production: false,
    APIGETEXPLOITATION: endPoint + 'exploitation',
    APIGETCREXPLOITATION: endPoint + 'centre-revenu/exploitation/',
    
    APILOGOUT: endPoint + 'api/logout',
    APILOGIN: endPoint + 'api/login',
    APIOPERATEURCONNECTE: endPoint + 'operateur/connecte',
    APIGETFOURNISSEUR: endPoint + 'fournisseur',
    APIGETCOMMANDE: endPoint + 'commande',


    APIGETARTICLE : endPoint + 'articles',
    APIGETARTICLEBYID: endPoint + 'articles/',
    APIGETARTICLEBYEXPLOITATION: endPoint + 'articles/exploitation/',


    APIGETUNITE: endPoint + 'unites',


    APIGETCATEGORIES: endPoint + 'categories',


    APIGETGROUPE: endPoint + 'groupe_analytique',
    APIGETFAMILLEBYGROUPE: endPoint + 'familles/groupe/',


    APIGETSOUSFAMILLEBYGROUPE: endPoint + 'sousfamilles/famille/'
};
