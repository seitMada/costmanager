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

    APIPOSTDESACTIVEFOURNISSEUR: endPoint + 'fournisseurexploitation/desactive_fournisseurexploitation/',
    APIPOSTDESACTIVEFOURNISSEURS: endPoint + 'fournisseurexploitation/desactive_fournisseurexploitations',
    APIUPDATEFOURNISSEUREXPLOITATION: endPoint + 'fournisseurexploitation/delete_fournisseurexploitation/',
    APIGETEXPLOITATIONBYFOURNISSEUR: endPoint + 'fournisseurexploitation/',

    APIGETCOMMANDEBYFOURNISSEUREXPLOITATION: endPoint + 'commande/fournisseur/',
    APIGETCOMMANDEBYFOURNISSEUREXPLOITATIONVALIDATE: endPoint + 'commande/fournisseurValidate/',
    APICREATECOMMANDEDETAIL :endPoint + 'commande/commandeDetail',
    APIGETDIXDERNIERCOMMANDE: endPoint + 'commande_detail/derniersCommandes/',
    APIGETCOMMANDEDETAILBYCOMMANDEID: endPoint + 'commande_detail/',
    APICREATECOMMANDE: endPoint + 'commande',
    APIDELETECOMMANDE: endPoint +'commande/delete_commande',

    APIGETARTICLE : endPoint + 'articles',
    APIGETARTICLEBYID: endPoint + 'articles/',
    APIGETARTICLEBYEXPLOITATION: endPoint + 'articles/exploitation/',
    APIPOSTCREATEARTICLE: endPoint + 'articles/add_articles',
    APIPOSTUPDATEARTICLE: endPoint + 'articles/update_articles/',
    APIPOSTDELETEARTICLE: endPoint + 'articles/delete_articles',
    APIPOSTDELETEARTICLES: endPoint + 'articles/delete_multi_articles',
    APIPOSTDESACTIVEARTICLE: endPoint + 'articleexploitation/desactive_articleexploitation/',
    APIPOSTDESACTIVEARTICLES: endPoint + 'articleexploitation/desactive_articleexploitations',
    APIGETARTICLEEXPLOITATIONBYEXPLOITATIONID: endPoint + 'articleexploitation/',

    APIGETARTICLEEXCLUDE : endPoint + 'articles/articleexclude',
    APIGETARTICLEBYIDFOURNISSEUR: endPoint + 'articles/fournisseur/',
    
    APIGETARTICLEBYFOURNISSEUR: endPoint + 'articlefournisseur/',
    APIADDARTICLEFOURNISSEUR: endPoint + 'articlefournisseur',
    APIDELETEARTICLEFOURNISSEUR: endPoint + 'articlefournisseur/delete',
    APIUPDATEARTICLEFOURNISSEUR: endPoint + 'articlefournisseur/update',

    APIADDCONDITIONNEMENT: endPoint + 'conditionement',
    APIUPDATECONDITIONNEMENT: endPoint + 'conditionement/update_conditionnement/',
    APIDELETECONDITIONNEMENT: endPoint + 'conditionement/delete',

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

    APIUPDATECOMPOSITION: endPoint + 'composition/update_composition/',
    APIGETCOMPOSITIONBYFICHETECHNIQUE: endPoint + 'composition/',

    APIPOSTDESACTIVEFICHETECHNIQUE: endPoint + 'fichetechniqueexploitation/desactive_fichetechniqueexploitation/',
    APIPOSTDESACTIVEFICHETECHNIQUES: endPoint + 'fichetechniqueexploitation/desactive_fichetechniqueexploitations',
    APIUPDATEFICHETECHNIQUEEXPLOITATION: endPoint + 'fichetechniqueexploitation/delete_fichetechniqueexploitation/',
    
    APIGETARTICLEBYFOURNISSEURIDANDEXPLOITATIONID: endPoint + 'articlefournisseur/',
    APIGETARTICLEFOURNISSEURBYARTICLEID: endPoint + 'articlefournisseur/byarticleId/',
    ARTICLEFOURNISSEURBYARTICLE: endPoint+ 'articlefournisseur/byarticleId',
    
    APIGETADRESS: endPoint + 'adresse',

    APIGETINVENTAIREBYCRANDDATEGROUPENUMERO: endPoint + 'inventaire',
    APICREATEINVENTAIRE: endPoint + 'inventaire/add',
    APIDELETEINVENTAIRE: endPoint + 'inventaire/delete',
    APIDELETESINVENTAIRE: endPoint + 'inventaire/deletes',
    APIUPDATEINVENTAIRE: endPoint + 'inventaire/update',
    APIGETINVENTAIREBYID: endPoint + 'inventaire/',
    APIGETINVENTAIREDETAILBYNUMERO: endPoint + 'inventaire/numero',
    
    APIGETLIEUSTOCKAGEBYCENTREID: endPoint + 'lieustockage',
    APIGETZONESTOCKAGEBYEXPLOITATIONID: endPoint + 'zonestockage/exploitation',
    // APIDELETEARTICLEZONESTOCKAGE:  endPoint + 'articlezonestockage/',
    // APIGETARTICLEBYZONE: endPoint + 'articlezonestockage/',
    
    APIGETZONESTOCKAGEBYLIEUID: endPoint + 'zonestockage',
    APIGETARTICLEBYZONE: endPoint + 'zonestockage/article',

    APIDELETEARTICLEZONESTOCKAGE: endPoint + 'articlezonestockage/delete/',

    APIGETPPOBYCRANDDATE: endPoint + 'ppo',
    APICREATEPPO: endPoint + 'ppo/create',
    APIUPDATEPPO: endPoint + 'ppo/update',
<<<<<<< Updated upstream

    APIGETLIVRAISONBYFOURNISSEUR : endPoint + 'livraison/fournisseur/',
    APICREATEBONLIVRAISON: endPoint + 'livraison',
    APIGETDETAILLIVRAISONBYLIVRAISONID : endPoint + 'livraison/',
    DELETEBONLIVRAISON: endPoint + 'livraison/delete',
=======
    APIDELETEPPO: endPoint + 'ppo/delete',
    APIDELETESPPO: endPoint + 'ppo/deletes',
>>>>>>> Stashed changes
};
