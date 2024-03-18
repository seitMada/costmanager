const endPoint = 'http://localhost:3000/';

export const environment = {
    production: false,
    APIGETEXPLOITATION: endPoint + 'exploitation',
    APIGETCREXPLOITATION: endPoint + 'centre-revenu/exploitation/',
    APILOGIN: endPoint + 'api/login',
    APIGETARTICLE : endPoint + 'articles',
    APILOGOUT: endPoint + 'api/logout',
};
