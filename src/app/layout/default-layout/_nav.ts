import {INavData} from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: {name: 'cil-speedometer'},
  },
  {
    name: 'Profile',
    url: '/profile',
    iconComponent: {name: 'cil-user'}
  },
  {
    name: 'Employés',
    url: '/employee-list',
    iconComponent: {name: 'cil-people'},

  },
  {
    name: 'Demandes',
    url: '/demande',
    iconComponent: {name: 'cil-notes'},
    children: [
      {
        name: 'Congé',
        url: '/demande/conge',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Attestation',
        url: '/demande/attestation',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Absences',
    iconComponent: { name: 'cil-user-unfollow' },
    url: '/absence',

  },
  {
    name: 'Retards',
    url: '/retard',
    iconComponent: {name: 'cil-calendar'},

  },
  {
    name: "Paie",
    url: "/paie",
    iconComponent: {name: 'cilMoney'},
    children: [
      {
        name: 'Bulletin de paie',
        url: 'paie/bulletin',
        icon: 'nav-icon-bullet'

      }
    ]
  },
  {
    name: 'Départements',
    iconComponent: { name: 'cil-building' },
    url: '/departement',
  },
  {
    name: 'Services',
    iconComponent: { name: 'cil-briefcase' },
    url: '/service',
  },
  {
    name: 'Fonctions',
    iconComponent: { name: 'cil-list-rich' },
    url: '/fonction'

  },
  {
    name: 'Utilisateurs',
    url: '/users/list',
    iconComponent: {name: 'cil-user'},
    //children: [
      //{
        //name: 'Ajouter',
        //url: '/register',
        //icon: 'nav-icon-bullet'
      //},
      //{
        //name: 'Liste utilisateurs',
        //url: '/users/list',
        //icon: 'nav-icon-bullet'
      //}
    //]

  },
  {
    name: 'Paramètres',
    iconComponent: { name: 'cil-settings' },
    url: '/parametres'

  }
];

export const EmpNavItems: INavData[] = [
  {
    name: 'Dashboard',
    url: 'employe/dashboard',
    iconComponent: {name: 'cil-speedometer'},
  },
  {
    name: 'Profile',
    url: '/profile',
    iconComponent: {name: 'cil-user'}
  },
  {
    name: 'Demandes',
    url: '/demande',
    iconComponent: {name: 'cil-notes'},
    children: [
      {
        name: 'Congé',
        url: 'employe/demande/conge',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Attestation',
        url: 'employe/demande/attestation',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Departements',
    url: 'employe/departement',
    iconComponent: {name: 'cil-building'},

  },
  {
    name: 'Services',
    url: 'employe/service',
    iconComponent: {name: 'cil-briefcase'},

  },
  {
    name: 'Fonctions',
    url: 'employe/fonction',
    iconComponent: {name: 'cil-list-rich'},

  },
  {
    name: 'Paramètres',
    iconComponent: { name: 'cil-settings' },
    url: '/parametres'

  }


];

export const SecNavItems: INavData[] = [
  {
    name: 'Dashboard',
    url: 'secretaire/dashboard',
    iconComponent: {name: 'cil-speedometer'},
  },
  {
    name: 'Profile',
    url: '/profile',
    iconComponent: {name: 'cil-user'}
  },
  {
    name: 'Demandes',
    url: '/demande',
    iconComponent: {name: 'cil-notes'},
    children: [
      {
        name: 'Congé',
        url: 'employe/demande/conge',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Attestation',
        url: 'employe/demande/attestation',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Absences',
    url: 'secretaire/absence',
    iconComponent: {name: 'cil-user-unfollow'},

  },
  {
    name: 'Retards',
    url: 'secretaire/retard',
    iconComponent: {name: 'cil-calendar'},

  },
  {
    name: 'Departements',
    url: 'secretaire/departement',
    iconComponent: {name: 'cil-building'},
  },
  {
    name: 'Services',
    url: 'secretaire/service',
    iconComponent: {name: 'cil-briefcase'},

  },
  {
    name: 'Fonctions',
    url: 'secretaire/fonction',
    iconComponent: {name: 'cil-list-rich'},

  },
  {
    name: 'Paramètres',
    iconComponent: { name: 'cil-settings' },
    url: '/parametres'

  }



];
