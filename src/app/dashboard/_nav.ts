import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Tableau de bord',
    url: 'dash',
    iconComponent: { name: 'cil-browser' },
  },
  {
    name: 'Donnée de base',
    url: '/donnee_de_base',
    iconComponent: { name: 'cil-layers' },
    children: [
      {
        name: 'Articles',
        url: 'donnee_de_base/articles'
      },
      {
        name: 'Fiches Techniques',
        url: 'donnee_de_base/fichetechnique'
      },
      {
        name: 'Fournisseurs',
        url: 'donnee_de_base/fournisseurs'
      },
      {
        name: 'Gestions des stocks',
        url: 'donnee_de_base/gestion_stock',
        iconComponent: { name: 'cil-clipboard' },
        children: [{
          name: 'Mouvements de stocks',
          url: 'donnee_de_base/gestion_stock/mouvement_stock'
        },




        {
          name: 'Stock minimum',
          url: 'donnee_de_base/gestion_stock/stock_minimum'
        },









        ]
      },
    ]
  },
  {
    name: 'Achats',
    url: '/achats',
    iconComponent: { name: 'cil-cart' },
    children: [








      {
        name: 'Bon de commande',
        url: 'achats/bon_commande'
      },
      {
        name: 'Bon de livraison',
        url: 'achats/bon_livraison'
      },
      {
        name: 'Factures',
        url: 'achats/factures'
      },
    ]
  },
  {
    name: 'Ventes',
    url: '/vente',
    iconComponent: { name: 'cil-euro' },






















  },














































  {
    name: 'Inventaires',
    url: '/inventaires',
    iconComponent: { name: 'cil-folder' },










  },
  {
    name: 'Pertes',
    url: '/ppo',
    iconComponent: { name: 'cil-trash' },
    children: [
      {
        name: 'Listes et creations Pertes',
        url: 'ppo/ppo'
      },
      {
        name: 'Synthese pertes',
        url: 'ppo/synthese_ppo'
      }
    ]
  },
  {
    name: 'Paramétres',
    url: '/settings',
    iconComponent: { name: 'cil-settings' },

    children: [


























      {
        name: 'Options',
        url: 'settings/option'
      },
      {
        name: "Utilisateurs",
        url: "settings/user",
      },
    ]
  }




































































































































































];
