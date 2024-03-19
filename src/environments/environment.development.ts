const endPoint = 'http://localhost:3000/';

export const environment = {
    production: false,
    APIGETEXPLOITATION: endPoint + 'exploitation',
    APIGETCREXPLOITATION: endPoint + 'centre-revenu/exploitation/',
    APILOGIN: endPoint + 'api/login',
    APIGETARTICLE : endPoint + 'articles',
    APILOGOUT: endPoint + 'api/logout',
    APIGETUNITE: endPoint + 'unites',
    APIGETCATEGORIES: endPoint + 'categories',
    APIGETGROUPE: endPoint + 'groupe_analytique',
    APIGETFAMILLEBYGROUPE: endPoint + 'familles/groupe_article/',
    APIOPERATEURCONNECTE: endPoint + 'operateur/connecte',
};
