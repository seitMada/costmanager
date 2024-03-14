const endPoint = 'http://localhost:3000/';

export const environment = {
    production: false,
    APIGETEXPLOITATION: endPoint + 'exploitation',
    APIGETCREXPLOITATION: endPoint + 'centre-revenu/exploitation/',
    APILOGIN: endPoint + 'operateur/login',
    APIGETARTICLE : endPoint + 'articles',
};
