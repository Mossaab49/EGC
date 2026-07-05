import { makeGameImage } from '../game-images.js'

/** @type {import('../../types/domain.js').Member[]} */
export const initialMembers = [
  { name: 'Yassine Amrani', email: 'yassine@etu.uae.ac.ma', role: 'Membre', points: 380, status: 'Actif' },
  { name: 'Salma Rami', email: 'salma@etu.uae.ac.ma', role: 'Membre', points: 352, status: 'Actif' },
  { name: 'Mohamed Boustani', email: 'mohamed@etu.uae.ac.ma', role: 'Membre', points: 245, status: 'Actif' },
  { name: 'Mossaab Saouti', email: 'mossaab@etu.uae.ac.ma', role: 'Admin', points: 190, status: 'Actif' },
]

/** @type {import('../../types/domain.js').EventItem[]} */
export const initialEvents = [
  {
    id: 'fifa-summer',
    title: 'FIFA 2v2 - Summer Cup',
    date: '20 juillet - 14:00',
    venue: 'ENSAT Arena',
    imageUrl: makeGameImage('FIFA', '#1E50B4', '#050a36'),
    status: 'A venir',
    category: 'Sport gaming',
    details: 'Tournoi 2v2 ouvert aux membres EGC. Equipes de deux, tirage du bracket avant le coup d envoi.',
    rules: 'Arriver 20 minutes avant le match. Manette personnelle autorisee.',
    postUrl: '#',
    isSignupOpen: true,
  },
  {
    id: 'valorant-campus',
    title: 'Valorant - Campus Clash',
    date: '02 aout - 10:00',
    venue: 'Amphi ENSAT',
    imageUrl: makeGameImage('VALORANT', '#A855F7', '#241044'),
    status: 'A venir',
    category: 'FPS',
    details: 'Rencontre Valorant avec phases de groupes et finale en BO3.',
    rules: 'Compte Riot obligatoire. Discord EGC requis pour les annonces.',
    postUrl: '#',
    isSignupOpen: false,
  },
  {
    id: 'far-clubs',
    title: 'FAR des Clubs',
    date: '16 aout - 16:00',
    venue: 'Terrain ENSAT',
    imageUrl: makeGameImage('EGC', '#F59E0B', '#634200'),
    status: 'A venir',
    category: 'Community day',
    details: 'Journee communautaire entre clubs ENSAT avec mini-jeux, stands et defis rapides.',
    rules: 'Acces libre. Les equipes seront composees sur place.',
    postUrl: '#',
    isSignupOpen: false,
  },
  {
    id: 'rocket-night',
    title: 'Rocket League Night',
    date: '12 juin - 18:00',
    venue: 'Salle B12',
    imageUrl: makeGameImage('ROCKET', '#17172B', '#090911'),
    status: 'Passe',
    category: 'Arcade',
    details: 'Soiree Rocket League casual avec rotations rapides et finale showmatch.',
    rules: 'Evenement termine.',
    postUrl: '#rocket-night',
    isSignupOpen: false,
  },
  {
    id: 'inter-ensa',
    title: 'Tournoi inter-ENSA',
    date: '25 mai - 09:00',
    venue: 'ENSAT',
    imageUrl: makeGameImage('ENSA', '#1E50B4', '#0D0D1A'),
    status: 'Passe',
    category: 'Inter-ecoles',
    details: 'Competition multi-jeux avec participants de plusieurs ENSA.',
    rules: 'Evenement termine.',
    postUrl: '#inter-ensa',
    isSignupOpen: false,
  },
]

/** @type {import('../../types/domain.js').Tournament[]} */
export const initialTournaments = [
  {
    id: 'valorant-duo',
    title: 'Valorant Duo Bracket',
    game: 'Valorant',
    date: 'Samedi 12 juillet - 18:00',
    capacity: 24,
    registered: 12,
    status: 'Actif',
    reward: '60 pts pour la premiere place',
    format: 'Duo - Elimination directe',
    imageUrl: makeGameImage('VALORANT', '#7C3AED', '#11122c'),
  },
]

export const initialWords = ['ARENA', 'PIXEL', 'SQUAD', 'GAMER', 'CLASH', 'LEVEL', 'ESPORT', 'VALORANT', 'MINECRAFT']

export const players = [
  ['1', 'Yassine Amrani', 'Y', 380, 'gold'],
  ['2', 'Salma Rami', 'S', 352, 'purple'],
  ['3', 'Omar Lahlou', 'O', 331, 'blue'],
  ['4', 'Mohamed B.', 'M', 245, 'blue'],
  ['5', 'Sara Benali', 'S', 228, 'slate'],
]

export const weeklyPlayers = [
  ['1', 'Sara Benali', 'S', 96, 'gold'],
  ['2', 'Omar Lahlou', 'O', 84, 'purple'],
  ['3', 'Yassine Amrani', 'Y', 78, 'blue'],
  ['4', 'Mohamed B.', 'M', 61, 'blue'],
  ['5', 'Salma Rami', 'S', 58, 'slate'],
]

/** @type {Array<{name: string, launcher: string, status: import('../../types/domain.js').RequestStatus}>} */
export const initialMinecraftRequests = [
  { name: 'gamer_ensat', launcher: 'TLauncher', status: 'En attente' },
  { name: 'nour_play', launcher: 'Officiel', status: 'En attente' },
  { name: 'ayoub10', launcher: 'TLauncher', status: 'Acceptee' },
]
