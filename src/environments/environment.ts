import { ENV } from '../env'
const endPoint = ENV.END_POINT;

export const environment = {
    production: false,
    APIGETEXPLOITATION: endPoint + 'exploitation',
    APICREATEEXPLOITATION: endPoint + 'exploitation',
    APIGETEXPLOITATIONBYID: endPoint + 'exploitation/',
    APIGETEXPLOITATIONBYCENTREID: endPoint + 'exploitation/centre/',
    APIGETLISTEXPLOITATION: endPoint + 'exploitation/list',
    APIGETALLEXPLOITATIONBYID: endPoint + 'exploitation/list/',
    APIDELETEEXPLOITATION: endPoint + 'exploitation/delete',
    APIUPDATEEXPLOITATION: endPoint + 'exploitation/update/',

    APIGETCREXPLOITATION: endPoint + 'centre-revenu/exploitation/',
    APIGETCENTREREVENUS: endPoint + 'centre-revenu',
    APICREATECENTREREVENUS: endPoint + 'centre-revenu',
    APIUPDATECENTREREVENUS: endPoint + 'centre-revenu/update/',
    APIDELETECENTREREVENU: endPoint + 'centre-revenu/delete',
    APIGETCENTREWITHOUTLINKS: endPoint + 'centre-revenu/list',

    APIGETEXPLOITATIONBYARTICLE: endPoint + 'articleexploitation/article_exploitation/',
    APIPOSTDELETEARTICLEEXPLOITATIONBYARTICLE: endPoint + 'articleexploitation/delete_articleexploitation/',
    APIPOSTCREATEARTICLEEXPLOITATION: endPoint + 'articleexploitation/add_article_exploitation',

    APILOGOUT: endPoint + 'api/logout',
    APILOGIN: endPoint + 'api/login',
    APILOGINADMIN: endPoint + 'api/loginadmin',
    APIOPERATEURCONNECTE: endPoint + 'operateur/connecte',
    APIADDOPERATEUR: endPoint + 'operateur',
    APIGETALLOPERATEUR: endPoint + 'operateur/list',
    APIGETOPERATEUR: endPoint + 'operateur/',
    APIDELETEOPERATEUR: endPoint + 'operateur/delete_operateur',
    APIDELETEOPERATEURS: endPoint + 'operateur/delete_operateurs/',
    APIUPDATEOPERATEURS: endPoint + 'operateur/update_operateur/',
    APIFINDOPERATEURBYID: endPoint + 'operateur/operateurid/',

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
    APICREATECOMMANDEDETAIL: endPoint + 'commande/commandeDetail',
    APIGETDIXDERNIERCOMMANDE: endPoint + 'commande_detail/derniersCommandes/',
    APIGETCOMMANDEDETAILBYCOMMANDEID: endPoint + 'commande_detail/',
    APICREATECOMMANDE: endPoint + 'commande',
    APIGETCOMMANDE: endPoint + 'commande/',
    APIDELETECOMMANDE: endPoint + 'commande/delete_commande',
    APIVALIDATECOMMANDE: endPoint + 'commande/validate',

    APIGETARTICLE: endPoint + 'articles',
    APIGETARTICLEBYID: endPoint + 'articles/',
    APIGETARTICLEBYEXPLOITATION: endPoint + 'articles/exploitation/',
    APIPOSTCREATEARTICLE: endPoint + 'articles/add_articles',
    APIPOSTUPDATEARTICLE: endPoint + 'articles/update_articles/',
    APIPOSTDELETEARTICLE: endPoint + 'articles/delete_articles',
    APIPOSTDELETEARTICLES: endPoint + 'articles/delete_multi_articles',

    APIGETVALUESTOCKTHEORIQUE: endPoint + 'articles/stocktheorique',

    APIPOSTDESACTIVEARTICLE: endPoint + 'articleexploitation/desactive_articleexploitation/',
    APIPOSTDESACTIVEARTICLES: endPoint + 'articleexploitation/desactive_articleexploitations',
    APIGETARTICLEEXPLOITATIONBYEXPLOITATIONID: endPoint + 'articleexploitation/',
    APIADDARTICLEEXPLOITATIONBYEXPLOITATION: endPoint + 'articleexploitation/addarticleexploitationbyexploitation',

    APIUPDATESTOCKMINIMUM: endPoint + 'articleexploitation/updatestock',

    APIGETPERIODE: endPoint + 'inventaire/periode',

    APIGETARTICLEEXCLUDE: endPoint + 'articles/articleexclude',
    APIGETARTICLEBYIDFOURNISSEUR: endPoint + 'articles/fournisseur/',
    APIGETMOUVEMENTSTOCK: endPoint + 'articles/mouvement',

    APIGETARTICLEBYFOURNISSEUR: endPoint + 'articlefournisseur/',
    APIGETARTICLEFOURNISSEURBYID: endPoint + 'articlefournisseur/list/',
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
    APIGETFAMILLEBYTYPE: endPoint + 'familles/type/',

    APIGETSOUSFAMILLEBYGROUPE: endPoint + 'sousfamilles/famille/',

    APIGETFICHETECHNIQUEBYID: endPoint + 'fichetechnique/',
    APIGETFICHETECHNIQUE: endPoint + 'fichetechnique',
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
    APIPOSTADDFICHETECHNIQUEEXPLOITATION: endPoint + 'fichetechniqueexploitation/addfichetechniqueexploitations',

    APIGETARTICLEBYFOURNISSEURIDANDEXPLOITATIONID: endPoint + 'articlefournisseur/',
    APIGETARTICLEFOURNISSEURBYARTICLEID: endPoint + 'articlefournisseur/byarticleId/',
    ARTICLEFOURNISSEURBYARTICLE: endPoint + 'articlefournisseur/byarticleId',

    APIGETADRESS: endPoint + 'adresse',
    APIADDADRESS: endPoint + 'adresse/addadresse',

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
    APIGETLIEUSTOCKAGEBYEXPLOITATIONID: endPoint + 'lieustockage/exploitation/',

    APIGETALLZONESTOCKAGEWITHOUTLINKS: endPoint + 'zonestockage',
    APIGETZONESTOCKAGEBYLIEUID: endPoint + 'zonestockage',
    APIGETARTICLEBYZONE: endPoint + 'zonestockage/article',
    APICREATEZONEDESTOCKAGE: endPoint + 'zonestockage/create',
    APIGETLISTZONEWITHOUTLINKSBYLIEUID: endPoint + 'zonestockage/listzone/',
    APIGETALLZONESTOCKAGE: endPoint + 'zonestockage/list',
    APIUPDATEZONESTOCKAGE: endPoint + 'zonestockage/update/',
    APIDELETEZONESTOCKAGE: endPoint + 'zonestockage/delete',

    APIDELETEARTICLEZONESTOCKAGE: endPoint + 'articlezonestockage/delete/',
    APIADDARTICLEZONESTOCKAGE: endPoint + 'articlezonestockage/add',

    APIGETPPOBYCRANDDATE: endPoint + 'ppo',
    APICREATEPPO: endPoint + 'ppo/create',
    APIUPDATEPPO: endPoint + 'ppo/update',

    APIGETLIVRAISONBYFOURNISSEUR: endPoint + 'livraison/fournisseur/',
    APICREATEBONLIVRAISON: endPoint + 'livraison',
    APIGETLIVRAISON: endPoint + 'livraison/',
    DELETEBONLIVRAISON: endPoint + 'livraison/delete',
    APIVALIDATELIVRAISON: endPoint + 'livraison/validate',
    APIGETLIVRAISONBYFOURNISSEUREXPLOITATIONVALIDATE: endPoint + 'livraison/fournisseurValidate/',

    APIGETDETAILLIVRAISONBYLIVRAISONID: endPoint + 'livraisondetail/',


    APIDELETEPPO: endPoint + 'ppo/delete',
    APIDELETESPPO: endPoint + 'ppo/deletes',
    APIPPOEXPLOITATION: endPoint + 'ppo/exploitation',
    APIPPOCENTREREVENU: endPoint + 'ppo/centrerevenu',

    APIGETFACTUREBYFOURNISSEUREXPLOITATION: endPoint + 'achat/facture/',
    APICREATEFACTURE: endPoint + 'achat',
    APIGETALLFACTURE: endPoint + 'achat/',
    APIGETFACTUREBYFOURNISSEUR: endPoint + 'achat/fournisseur/',
    APIVALIDATEFACTURE: endPoint + 'achat/validate',

    APIPPODETAILEXPLOITATION: endPoint + 'ppo/exploitation/detail',
    APIPPODETAILCENTREREVENU: endPoint + 'ppo/centrerevenu/detail',
    APIGETPPODETAIL: endPoint + 'ppo/detail',
    APIGETPPODETAILDATA: endPoint + 'ppo/data',
    APIGETPPODETAILDATAFAMILLE: endPoint + 'ppo/data/famille',

    APIGETVENTEBYCRANDDATE: endPoint + 'vente',
    APICREATEVENTE: endPoint + 'vente/create',
    APIUPDATEVENTE: endPoint + 'vente/update',
    APICOUNTVENTE: endPoint + 'vente/count',
    APIUPLOADVENTE: endPoint + 'vente/upload',
    APIIMPORTVENTE: endPoint + 'vente/importedfile',

    APIVARIATIONARTICLE: endPoint + 'articles/articlevariationprix',

    APIGETALLLIEUSTOCKAGE: endPoint + 'lieustockage',
    APIGETLISTLIEUSTOCKAGE: endPoint + 'lieustockage/list/',
    APICREATELIEUSTOCKAGE: endPoint + 'lieustockage/create',
    APIGETLIEUSTOCKAGESANSLIEN: endPoint + 'lieustockage/sansLien',
    APIUPDATELIEUSTOCKAGE: endPoint + 'lieustockage/update/',
    APIDELETEONELIEUSTOCKAGE: endPoint + 'lieustockage/delete',

    APIGETOPERATEURCENTREEXPLOITATIONBYOPERATEURID: endPoint + 'operateurcentreexploit/',
    APIGETPERTEARTICLE: endPoint + 'ppo/byarticle/',
    APIGETPPOSTATISTIQUE: endPoint + 'ppo/statistics/',

    APIGETVALORISATIONSTOCK: endPoint + 'inventaire_detail/stock/',
    APIGETARTICLEINVENTAIRE: endPoint + 'inventaire_detail/',
    APIGETLASTPERIODEINVENTAIRE: endPoint + 'inventaire_detail/dernierperiodeinventaire',

    APIGETARTICLEPLUSUTILISE: endPoint + 'vente_detail',

};

