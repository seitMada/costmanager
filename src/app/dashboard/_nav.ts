import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Donnée de base',
    url: '/donnee_de_base',
    iconComponent: { name: 'cil-puzzle' },
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
        name: 'Gestions de stocks',
        url: 'donnee_de_base/gestion_stock',
        iconComponent: { name: 'cil-puzzle' },
        children: [{
          name: 'Mouvements de stocks',
          url: 'donnee_de_base/gestion_stock/mouvement_stock'
        },
        {
          name: 'Gestion de stock minimum',
          url: 'donnee_de_base/gestion_stock/gestion_stock_minimum'
        },
        {
          name: 'Stock minimum',
          url: 'donnee_de_base/gestion_stock/stock_minimum'
        },
        {
          name: 'Zones de stockage',
          url: 'donnee_de_base/gestion_stock/zones_stockages'
        }]
      },
    ]
  },
  {
    name: 'Achats',
    url: '/achats',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Simulations',
        url: 'achats/simulations'
      },
      {
        name: 'Mercuriales',
        url: 'achats/mercuriales'
      },
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
  }
  // {
  //   name: 'Buttons',
  //   url: '/buttons',
  //   iconComponent: { name: 'cil-cursor' },
  //   children: [
  //     {
  //       name: 'Buttons',
  //       url: '/buttons/buttons'
  //     },
  //     {
  //       name: 'Button groups',
  //       url: '/buttons/button-groups'
  //     },
  //     {
  //       name: 'Dropdowns',
  //       url: '/buttons/dropdowns'
  //     }
  //   ]
  // },
  // {
  //   name: 'Forms',
  //   url: '/forms',
  //   iconComponent: { name: 'cil-notes' },
  //   children: [
  //     {
  //       name: 'Form Control',
  //       url: '/forms/form-control'
  //     },
  //     {
  //       name: 'Select',
  //       url: '/forms/select'
  //     },
  //     {
  //       name: 'Checks & Radios',
  //       url: '/forms/checks-radios'
  //     },
  //     {
  //       name: 'Range',
  //       url: '/forms/range'
  //     },
  //     {
  //       name: 'Input Group',
  //       url: '/forms/input-group'
  //     },
  //     {
  //       name: 'Floating Labels',
  //       url: '/forms/floating-labels'
  //     },
  //     {
  //       name: 'Layout',
  //       url: '/forms/layout'
  //     },
  //     {
  //       name: 'Validation',
  //       url: '/forms/validation'
  //     }
  //   ]
  // },
  // {
  //   name: 'Charts',
  //   url: '/charts',
  //   iconComponent: { name: 'cil-chart-pie' }
  // },
  // {
  //   name: 'Icons',
  //   iconComponent: { name: 'cil-star' },
  //   url: '/icons',
  //   children: [
  //     {
  //       name: 'CoreUI Free',
  //       url: '/icons/coreui-icons',
  //       badge: {
  //         color: 'success',
  //         text: 'FREE'
  //       }
  //     },
  //     {
  //       name: 'CoreUI Flags',
  //       url: '/icons/flags'
  //     },
  //     {
  //       name: 'CoreUI Brands',
  //       url: '/icons/brands'
  //     }
  //   ]
  // },
  // {
  //   name: 'Notifications',
  //   url: '/notifications',
  //   iconComponent: { name: 'cil-bell' },
  //   children: [
  //     {
  //       name: 'Alerts',
  //       url: '/notifications/alerts'
  //     },
  //     {
  //       name: 'Badges',
  //       url: '/notifications/badges'
  //     },
  //     {
  //       name: 'Modal',
  //       url: '/notifications/modal'
  //     },
  //     {
  //       name: 'Toast',
  //       url: '/notifications/toasts'
  //     }
  //   ]
  // },
  // {
  //   name: 'Widgets',
  //   url: '/widgets',
  //   iconComponent: { name: 'cil-calculator' },
  //   badge: {
  //     color: 'info',
  //     text: 'NEW'
  //   }
  // },
  // {
  //   title: true,
  //   name: 'Extras'
  // },
  // {
  //   name: 'Pages',
  //   url: '/login',
  //   iconComponent: { name: 'cil-star' },
  //   children: [
  //     {
  //       name: 'Login',
  //       url: '/login'
  //     },
  //     {
  //       name: 'Register',
  //       url: '/register'
  //     },
  //     {
  //       name: 'Error 404',
  //       url: '/404'
  //     },
  //     {
  //       name: 'Error 500',
  //       url: '/500'
  //     }
  //   ]
  // },
  // {
  //   title: true,
  //   name: 'Links',
  //   class: 'py-0'
  // },
  // {
  //   name: 'Docs',
  //   url: 'https://coreui.io/angular/docs/templates/installation',
  //   iconComponent: { name: 'cil-description' },
  //   attributes: { target: '_blank', class: '-text-dark' },
  //   class: 'mt-auto'
  // },
  // {
  //   name: 'Try CoreUI PRO',
  //   url: 'https://coreui.io/product/angular-dashboard-template/',
  //   iconComponent: { name: 'cil-layers' },
  //   attributes: { target: '_blank' }
  // }
];
