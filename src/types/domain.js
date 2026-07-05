/**
 * @typedef {'Admin' | 'Membre'} UserRole
 * @typedef {'Actif' | 'Invite'} MemberStatus
 * @typedef {'A venir' | 'Passe' | 'Brouillon'} EventStatus
 * @typedef {'Actif' | 'Brouillon' | 'Termine'} TournamentStatus
 * @typedef {'Acceptee' | 'Refusee' | 'En attente'} RequestStatus
 * @typedef {'home' | 'events' | 'activities' | 'account' | 'ranking' | 'admin'} PageId
 * @typedef {'overview' | 'members' | 'wordle' | 'events' | 'tournaments' | 'minecraft'} AdminTabId
 */

/**
 * @typedef {object} Member
 * @property {string} name
 * @property {string} email
 * @property {UserRole} role
 * @property {number} points
 * @property {MemberStatus} status
 * @property {string=} password
 * @property {string=} passwordUpdatedAt
 */

/**
 * @typedef {object} EventItem
 * @property {string} id
 * @property {string} title
 * @property {string} date
 * @property {string} venue
 * @property {string} imageUrl
 * @property {EventStatus} status
 * @property {string} category
 * @property {string} details
 * @property {string} rules
 * @property {string} postUrl
 * @property {boolean} isSignupOpen
 */

/**
 * @typedef {object} Tournament
 * @property {string} id
 * @property {string} title
 * @property {string} game
 * @property {string} date
 * @property {number} capacity
 * @property {number} registered
 * @property {TournamentStatus} status
 * @property {string} reward
 * @property {string} format
 * @property {string} imageUrl
 */

/**
 * @typedef {object} ToastMessage
 * @property {string} title
 * @property {string} copy
 */

/**
 * @typedef {object} SuccessMessage
 * @property {string} title
 * @property {string} copy
 * @property {() => void=} action
 * @property {string=} actionLabel
 */

export {}
