const endPoint = 'http://localhost:3000/';

export const environment = {
    production: false,
    APIGETEXPLOITATION: endPoint + 'exploitation',
    APIGETEXPLOITATIONBYID: endPoint+'exploitation/',
    APIGETCREXPLOITATION: endPoint + 'centre-revenu/exploitation/',

    APIGETEXPLOITATIONBYARTICLE: endPoint + 'articleexploitation/article_exploitation/',
    APIPOSTDELETEARTICLEEXPLOITATIONBYARTICLE: endPoint + 'articleexploitation/delete_articleexploitation/',
    APIPOSTCREATEARTICLEEXPLOITATION:  endPoint + 'articleexploitation/add_article_exploitation',
    
    APILOGOUT: endPoint + 'api/logout',
    APILOGIN: endPoint + 'api/login',
    APIOPERATEURCONNECTE: endPoint + 'operateur/connecte',
    APIADDOPERATEUR: endPoint + 'operateur',
    APIGETOPERATEUR: endPoint + 'operateur/',
    APIDELETEOPERATEUR: endPoint + 'operateur/delete_operateur',
    APIDELETEOPERATEURS: endPoint + 'operateur/delete_operateurs/',
    APIUPDATEOPERATEURS: endPoint + 'operateur/update_operateur/',
    
    APIGETFOURNISSEUR: endPoint + 'fournisseur',
    APIGETFOURNISSEURBYEXPLOITATION: endPoint + 'fournisseur/exploitation/',
    APIONEFOURNISSEUR: endPoint + 'fournisseur/',
    APIFOURNISSEURBYID: endPoint + 'fournisseur/',
    APIADDFOURNISSEUR: endPoint + 'fournisseur',
    APIUPDATEFOURNISSEUR: endPoint + 'fournisseur/update_fournisseur/',

    APIGETARTICLEBYFOURNISSEUR: endPoint + 'articlefournisseur/',

    APIPOSTDESACTIVEFOURNISSEUR: endPoint + 'fournisseurexploitation/desactive_fournisseurexploitation/',
    APIPOSTDESACTIVEFOURNISSEURS: endPoint + 'fournisseurexploitation/desactive_fournisseurexploitations',
    APIUPDATEFOURNISSEUREXPLOITATION: endPoint + 'fournisseurexploitation/delete_fournisseurexploitation/',
    APIGETEXPLOITATIONBYFOURNISSEUR: endPoint + 'fournisseurexploitation/',

    APIGETCOMMANDE: endPoint + 'commande',


    APIGETARTICLE : endPoint + 'articles',
    APIGETARTICLEBYID: endPoint + 'articles/',
    APIGETARTICLEBYEXPLOITATION: endPoint + 'articles/exploitation/',
    APIPOSTCREATEARTICLE: endPoint + 'articles/add_articles',
    APIPOSTUPDATEARTICLE: endPoint + 'articles/update_articles/',
    APIPOSTDELETEARTICLE: endPoint + 'articles/delete_articles',
    APIPOSTDELETEARTICLES: endPoint + 'articles/delete_multi_articles',
    APIPOSTDESACTIVEARTICLE: endPoint + 'articleexploitation/desactive_articleexploitation/',
    APIPOSTDESACTIVEARTICLES: endPoint + 'articleexploitation/desactive_articleexploitations',
    APIGETARTICLEEXCLUDE : endPoint + 'articles/articleexclude',

    APIUPDATECOMPOSITION: endPoint + 'composition/update_composition/',
    APIGETCOMPOSITIONBYFICHETECHNIQUE: endPoint + 'composition/',
    
    APIPOSTDELETEALLERGENEARTICLE: endPoint + 'allergenearticle/delete_allergenearticle/',
    APIGETALLERGENE: endPoint + 'allergene',


    APIGETUNITE: endPoint + 'unites',


    APIGETCATEGORIES: endPoint + 'categories',


    APIGETGROUPE: endPoint + 'groupe_analytique',
    APIGETFAMILLEBYGROUPE: endPoint + 'familles/groupe/',


    APIGETSOUSFAMILLEBYGROUPE: endPoint + 'sousfamilles/famille/',

    APIGETFICHETECHNIQUEBYID: endPoint + 'fichetechnique/',
    APIGETFICHETECHNIQUEBYEXPLOITATION: endPoint + 'fichetechnique/exploitation/',
    APIADDFICHETECHNIQUE: endPoint + 'fichetechnique/add_fichetechniques',
    APIGETEXPLOITATIONBYFICHETECHNIQUE: endPoint + 'fichetechniqueexploitation/',
    APIUPDATEFICHETECHNIQUE: endPoint + 'fichetechnique/update_fichetechniques/',
    APIPOSTDELETEFICHETECHNIQUE: endPoint + 'fichetechnique/delete_fichetechnique',
    APIPOSTDELETEFICHETECHNIQUES: endPoint + 'fichetechnique/delete_multi_fichetechnique',

    APIPOSTDESACTIVEFICHETECHNIQUE: endPoint + 'fichetechniqueexploitation/desactive_fichetechniqueexploitation/',
    APIPOSTDESACTIVEFICHETECHNIQUES: endPoint + 'fichetechniqueexploitation/desactive_fichetechniqueexploitations',
    APIUPDATEFICHETECHNIQUEEXPLOITATION: endPoint + 'fichetechniqueexploitation/delete_fichetechniqueexploitation/',

    APICREATECOMMANDE: endPoint + '/commande',
    APIGETARTICLEBYFOURNISSEURIDANDEXPLOITATIONID: endPoint + 'articlefournisseur/',
    // APIGETARTICLEEXPLOITATIONBYEXPLOITATIONID: endPoint + 'articleexploitation/',

    APIGETADRESS: endPoint + 'adresse'
};
