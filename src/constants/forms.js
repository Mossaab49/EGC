/** @type {Omit<import('../types/domain.js').EventItem, 'id' | 'isSignupOpen'>} */
export const emptyEventForm = {
  title: '',
  date: '',
  venue: '',
  status: 'A venir',
  imageUrl: '',
  category: '',
  details: '',
  rules: '',
  postUrl: '',
}

/** @type {Omit<import('../types/domain.js').Tournament, 'id'>} */
export const emptyTournamentForm = {
  title: '',
  game: '',
  date: '',
  capacity: 16,
  registered: 0,
  status: 'Brouillon',
  format: '',
  reward: '',
  imageUrl: '',
}
