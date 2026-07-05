/** @type {Array<{id: import('../types/domain.js').PageId, label: string, icon: string}>} */
export const navItems = [
  { id: 'home', label: 'Accueil', icon: 'H' },
  { id: 'events', label: 'Evenements', icon: 'E' },
  { id: 'activities', label: 'Activites', icon: 'A' },
  { id: 'account', label: 'Compte', icon: 'U' },
  { id: 'ranking', label: 'Classement', icon: '#' },
  { id: 'admin', label: 'Admin', icon: '*' },
]

/** @type {Array<{id: import('../types/domain.js').AdminTabId, label: string, icon: string}>} */
export const adminTabs = [
  { id: 'overview', label: 'Tableau de bord', icon: 'DB' },
  { id: 'members', label: 'Membres', icon: 'MB' },
  { id: 'wordle', label: 'Wordle', icon: 'WD' },
  { id: 'events', label: 'Evenements', icon: 'EV' },
  { id: 'tournaments', label: 'Tournois', icon: 'TR' },
  { id: 'minecraft', label: 'Minecraft', icon: 'MC' },
]
