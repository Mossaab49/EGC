import React, { useEffect, useMemo, useState } from 'react'

const navItems = [
  { id: 'home', label: 'Accueil', icon: 'H' },
  { id: 'events', label: 'Evenements', icon: 'E' },
  { id: 'activities', label: 'Activites', icon: 'A' },
  { id: 'ranking', label: 'Classement', icon: '#' },
  { id: 'admin', label: 'Admin', icon: '*' },
]

const adminTabs = [
  { id: 'overview', label: 'Tableau de bord', icon: 'DB' },
  { id: 'members', label: 'Membres', icon: 'MB' },
  { id: 'wordle', label: 'Wordle', icon: 'WD' },
  { id: 'events', label: 'Evenements', icon: 'EV' },
  { id: 'tournaments', label: 'Tournois', icon: 'TR' },
  { id: 'minecraft', label: 'Minecraft', icon: 'MC' },
]

const initialMembers = [
  { name: 'Yassine Amrani', email: 'yassine@etu.uae.ac.ma', role: 'Membre', points: 380, status: 'Actif' },
  { name: 'Salma Rami', email: 'salma@etu.uae.ac.ma', role: 'Membre', points: 352, status: 'Actif' },
  { name: 'Mohamed Boustani', email: 'mohamed@etu.uae.ac.ma', role: 'Membre', points: 245, status: 'Actif' },
  { name: 'Mossaab Saouti', email: 'mossaab@etu.uae.ac.ma', role: 'Admin', points: 190, status: 'Actif' },
]

const initialEvents = [
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

const initialTournaments = [
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

const initialWords = ['ARENA', 'PIXEL', 'SQUAD', 'GAMER', 'CLASH', 'LEVEL', 'ESPORT', 'VALORANT', 'MINECRAFT']

const fallbackEnglishGuessWords = ['GAME', 'GAMES', 'MATCH', 'ROUND', 'SCORE', 'PLAYER', 'SERVER', 'STREAM']

function parseWordList(text) {
  return text
    .split(/\s+/)
    .map((word) => word.trim().toUpperCase())
    .filter((word) => /^[A-Z]+$/.test(word))
}

const players = [
  ['1', 'Yassine Amrani', 'Y', 380, 'gold'],
  ['2', 'Salma Rami', 'S', 352, 'purple'],
  ['3', 'Omar Lahlou', 'O', 331, 'blue'],
  ['4', 'Mohamed B.', 'M', 245, 'blue'],
  ['5', 'Sara Benali', 'S', 228, 'slate'],
]

const weeklyPlayers = [
  ['1', 'Sara Benali', 'S', 96, 'gold'],
  ['2', 'Omar Lahlou', 'O', 84, 'purple'],
  ['3', 'Yassine Amrani', 'Y', 78, 'blue'],
  ['4', 'Mohamed B.', 'M', 61, 'blue'],
  ['5', 'Salma Rami', 'S', 58, 'slate'],
]

const emptyEventForm = {
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

const emptyTournamentForm = {
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

function makeGameImage(label, from, to) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient><pattern id="p" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M44 0H0v44" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="2"/></pattern></defs><rect width="900" height="520" fill="url(#g)"/><rect width="900" height="520" fill="url(#p)" opacity=".55"/><circle cx="720" cy="375" r="190" fill="rgba(255,255,255,.15)"/><circle cx="720" cy="375" r="115" fill="rgba(255,255,255,.12)"/><text x="64" y="305" fill="white" font-family="Arial, sans-serif" font-size="86" font-weight="900">${label}</text><text x="68" y="370" fill="rgba(255,255,255,.72)" font-family="Arial, sans-serif" font-size="30" font-weight="700">ENSAT GAMING CLUB</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function makeHeroConsoleImage() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620"><defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#315FD0"/><stop offset=".52" stop-color="#17172B"/><stop offset="1" stop-color="#0D0D1A"/></linearGradient><radialGradient id="glow" cx=".68" cy=".5" r=".58"><stop stop-color="#F59E0B" stop-opacity=".75"/><stop offset=".48" stop-color="#315FD0" stop-opacity=".32"/><stop offset="1" stop-color="#11122C" stop-opacity="0"/></radialGradient><pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M44 0H0v44" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="2"/></pattern></defs><rect width="900" height="620" fill="url(#bg)"/><rect width="900" height="620" fill="url(#grid)" opacity=".48"/><circle cx="655" cy="310" r="330" fill="url(#glow)"/><path d="M254 247c-32 0-62 20-75 50l-44 104c-17 40 12 84 55 84 20 0 39-10 50-27l25-38h370l25 38c11 17 30 27 50 27 43 0 72-44 55-84l-44-104c-13-30-43-50-75-50H254Z" fill="#F8FAFC" opacity=".96"/><path d="M244 276c-22 0-43 14-51 35l-40 96c-9 22 7 46 31 46 12 0 24-6 31-16l36-52h398l36 52c7 10 19 16 31 16 24 0 40-24 31-46l-40-96c-8-21-29-35-51-35H244Z" fill="#11122C"/><path d="M290 332h38v-38h42v38h38v42h-38v38h-42v-38h-38v-42Z" fill="#F59E0B"/><circle cx="580" cy="343" r="28" fill="#315FD0"/><circle cx="655" cy="343" r="28" fill="#22C55E"/><circle cx="617" cy="299" r="23" fill="#A855F7"/><circle cx="617" cy="387" r="23" fill="#F8FAFC"/><rect x="427" y="325" width="80" height="22" rx="11" fill="#6B7280"/><path d="M205 185c76-44 163-66 260-66 98 0 185 22 260 66" fill="none" stroke="rgba(255,255,255,.24)" stroke-width="18" stroke-linecap="round"/><path d="M238 523c130 35 298 36 432 0" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="14" stroke-linecap="round"/></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function readImageFile(event, onLoad) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => onLoad(String(reader.result))
  reader.readAsDataURL(file)
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  return <button className={`btn ${variant} ${className}`} {...props}>{children}</button>
}

function Pill({ children, tone = 'blue', className = '' }) {
  return <span className={`pill ${tone} ${className}`}>{children}</span>
}

function PageHeader({ eyebrow, title, lead, children }) {
  return (
    <header className="page-header">
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="section-title">{title}</h1>
        <p className="lead">{lead}</p>
        {children}
      </div>
    </header>
  )
}

function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-card">{children}</div>
    </div>
  )
}

function Toast({ toast }) {
  if (!toast) return null

  return (
    <div className="toast" role="status">
      <span className="toast-spark">*</span>
      <div><strong>{toast.title}</strong><p>{toast.copy}</p></div>
    </div>
  )
}

function EventCard({ event, onSignup, onDetails, mode = 'upcoming' }) {
  const isPast = mode === 'past' || event.status === 'Passe'

  return (
    <article className="event-card reveal-card">
      <div className="event-cover image-cover">
        <img src={event.imageUrl || makeGameImage('EGC', '#1E50B4', '#0D0D1A')} alt="" />
        <Pill className="event-status-pill" tone={isPast ? 'muted' : event.isSignupOpen ? 'gold' : 'blue'}>{isPast ? 'Passe' : event.isSignupOpen ? 'Inscription ouverte' : event.status}</Pill>
        <div className="cover-orbit" />
      </div>
      <div className="event-content">
        <h3>{event.title}</h3>
        <p>{event.date} - {event.venue}</p>
        <div className="event-card-actions">
          {isPast ? (
            <Button variant="secondary" onClick={() => window.open(event.postUrl || '#', '_blank', 'noopener,noreferrer')}>Voir post</Button>
          ) : (
            <Button onClick={() => onSignup(event)} disabled={!event.isSignupOpen} className={!event.isSignupOpen ? 'is-disabled' : ''}>S'inscrire <span>-&gt;</span></Button>
          )}
          <Button variant="ghost" onClick={() => onDetails(event)}>Infos</Button>
        </div>
      </div>
    </article>
  )
}

function EventInfoModal({ event, onClose }) {
  return (
    <Modal open={Boolean(event)} onClose={onClose}>
      {event && (
        <>
          <button className="modal-close" onClick={onClose}>x</button>
          <div className="modal-symbol">i</div>
          <h2>{event.title}</h2>
          <p>{event.details}</p>
          <div className="event-info-list">
            <Detail label="Date" text={event.date} />
            <Detail label="Lieu" text={event.venue} />
            <Detail label="Categorie" text={event.category || 'EGC'} />
            <Detail label="Regles" text={event.rules || 'Les infos seront completees par l admin.'} />
          </div>
        </>
      )}
    </Modal>
  )
}

function Home({ go }) {
  const clubPoints = [
    ['Competition', 'Tournois campus, challenges rapides et brackets hebdomadaires pour jouer serieusement sans perdre l ambiance club.'],
    ['Communaute', 'Un espace pour rencontrer des joueurs ENSAT, creer des equipes et progresser ensemble.'],
    ['Creation', 'Soirees Minecraft, Wordle EGC, contenus sociaux et formats fun portes par les membres.'],
  ]

  return (
    <>
      <section className="hero">
        <div className="hero-glow glow-blue" /><div className="hero-glow glow-gold" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <Pill tone="gold">ENSAT GAMING CLUB</Pill>
            <h1>Le terrain de jeu<br />de la communaute ENSAT.</h1>
            <p>Evenements, competitions et activites quotidiennes pour reunir les joueurs, developper l'esprit d'equipe et faire vivre le gaming a Tanger.</p>
            <div className="hero-actions">
              <Button variant="gold" onClick={() => go('events')}>Decouvrir les evenements <span>-&gt;</span></Button>
              <Button variant="secondary" onClick={() => go('activities')}>Explorer le club</Button>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="live-pill"><span className="live-dot" /> EN DIRECT - EGC</div>
            <div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" />
            <div className="console-card">
              <img className="console-image" src="/assets/logo/whiteLogoWithPlay.PNG" alt="" />
              <div className="console-grid" />
            </div>
          </div>
        </div>
      </section>
      <section className="section club-section">
        <div className="container club-layout">
          <div className="club-intro">
            <p className="eyebrow">Notre club</p>
            <h2>Un club gaming fait pour jouer, organiser et rassembler.</h2>
            <p>EGC cree un cadre simple pour les etudiants qui veulent participer a des activites gaming, apprendre l organisation d evenements et construire une communaute active autour du fair-play.</p>
            <Button variant="secondary" onClick={() => go('activities')}>Voir les activites</Button>
          </div>
          <div className="club-grid">
            {clubPoints.map(([title, copy], index) => (
              <article className="club-card reveal-card" key={title} style={{ '--delay': `${index * 80}ms` }}>
                <b>{String(index + 1).padStart(2, '0')}</b>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function Events({ events, openSignup }) {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const upcoming = events.filter((event) => event.status !== 'Passe')
  const past = events.filter((event) => event.status === 'Passe')

  return (
    <>
      <PageHeader eyebrow="Evenements" title="Competitions & grands evenements" lead="Rejoins les rendez-vous qui font vivre le gaming a l'ENSAT.">
        <div className="filter-row"><Pill>{upcoming.length} A VENIR</Pill><Pill tone="muted">{past.length} PASSES</Pill></div>
      </PageHeader>
      <section className="section"><div className="container">
        <div className="card-grid">{upcoming.map((event) => <EventCard key={event.id} event={event} onSignup={openSignup} onDetails={setSelectedEvent} />)}</div>
        <div className="archive-block">
          <p className="eyebrow">Archives</p><h2>Evenements passes</h2>
          <div className="card-grid">{past.map((event) => <EventCard key={event.id} event={event} mode="past" onSignup={openSignup} onDetails={setSelectedEvent} />)}</div>
        </div>
      </div></section>
      <EventInfoModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  )
}

function Activities({ go, showSuccess, toast, wordBank, tournaments }) {
  const [tab, setTab] = useState('wordle')
  const [registered, setRegistered] = useState(false)
  const [minecraftSent, setMinecraftSent] = useState(false)
  const activeTournament = tournaments.find((tournament) => tournament.status === 'Actif') || tournaments[0]
  const tournamentFallbackImage = makeGameImage('TOURNOI', '#7C3AED', '#11122c')
  const tournamentImage = activeTournament?.imageUrl || tournamentFallbackImage

  return (
    <>
      <PageHeader eyebrow="Espace membre" title="Activites EGC" lead="Joue chaque jour, participe aux tournois et construis ta progression dans la communaute.">
        <div className="tabs">{[['wordle', 'Wordle EGC'], ['tournament', 'Tournoi hebdomadaire'], ['minecraft', 'Serveur Minecraft']].map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`tab ${tab === id ? 'active' : ''}`}>{label}</button>)}</div>
      </PageHeader>
      <section className="section compact"><div className="container">
        {tab === 'wordle' && <WordleGame wordBank={wordBank} showSuccess={showSuccess} go={go} />}
        {tab === 'tournament' && <div className="tournament-layout fade-enter">
          <div className="tournament-banner image-tournament"><img src={tournamentImage} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = tournamentFallbackImage }} /><Pill tone="gold">TOURNOI HEBDOMADAIRE</Pill><Button className="tournament-register-btn" variant={registered ? 'danger' : 'gold'} onClick={() => { if (registered) { setRegistered(false); toast({ title: 'Inscription annulee', copy: 'Tu peux te reinscrire avant la fermeture du tournoi.' }); return } setRegistered(true); showSuccess({ title: 'Inscription confirmee', copy: 'Ton dossard #EGC-024 est reserve. Le lien Discord sera envoye avant le tournoi.', action: () => go('ranking'), actionLabel: 'Voir le classement' }) }}>{registered ? "Annuler l'inscription" : "S'inscrire au tournoi"}</Button></div>
          <div className="panel details-panel"><h3>Infos du tournoi</h3><Detail label="Format" text={activeTournament?.format || 'Format a definir'} /><Detail label="Recompense" text={activeTournament?.reward || 'Recompense a definir'} /><Detail label="Serveur" text="Discord EGC - #tournois" /><Detail label="Date" text={activeTournament?.date || 'Date a definir'} />{registered && <div className="ticket"><strong>OK Inscription confirmee</strong></div>}</div>
        </div>}
        {tab === 'minecraft' && <div className="minecraft-layout fade-enter">
          <div className="minecraft-banner"><Pill tone="gold">OUVERT AUX MEMBRES</Pill><h2>EGC<br />MINECRAFT</h2><p>Survie - Creation - Evenements<br />Un monde construit ensemble.</p><small>Respect - entraide - fair-play</small></div>
          <form className="panel minecraft-form" onSubmit={(event) => { event.preventDefault(); setMinecraftSent(true); toast({ title: 'Demande envoyee', copy: 'Le responsable Minecraft recevra tes informations.' }) }}><h3>Demander une participation</h3><p>Ta demande sera transmise au responsable du serveur.</p><Field required label="Pseudo Minecraft" placeholder="ex. gamer_ensat" /><Field required label="Launcher utilise" placeholder="ex. TLauncher / officiel" /><Field required label="Nom du compte Aternos" placeholder="ex. EGC-survival" /><label className="check"><input required type="checkbox" /> J'accepte les regles de conduite du serveur.</label><Button type="submit" variant={minecraftSent ? 'success' : 'primary'}>{minecraftSent ? 'OK Demande envoyee' : 'Envoyer la demande'}</Button></form>
        </div>}
      </div></section>
    </>
  )
}

function WordleGame({ wordBank, showSuccess, go }) {
  const playableWords = useMemo(() => wordBank.filter((word) => word.length >= 3), [wordBank])
  const [englishGuessWords, setEnglishGuessWords] = useState(fallbackEnglishGuessWords)
  const [dictionaryLoaded, setDictionaryLoaded] = useState(false)
  const validGuesses = useMemo(() => new Set([...playableWords, ...englishGuessWords]), [playableWords, englishGuessWords])
  const [wordIndex, setWordIndex] = useState(0)
  const answer = playableWords[wordIndex % playableWords.length] || 'ARENA'
  const [guesses, setGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [message, setMessage] = useState(`Entre un mot de ${answer.length} lettres.`)
  const isWon = guesses.includes(answer)
  const isLost = guesses.length >= 6 && !isWon

  useEffect(() => {
    setGuesses([])
    setCurrentGuess('')
    setMessage(`Entre un mot de ${answer.length} lettres.`)
  }, [answer])

  useEffect(() => {
    let cancelled = false

    async function loadDictionary() {
      const paths = ['/assets/words.txt', '/dist/assets/words.txt']

      for (const path of paths) {
        try {
          const response = await fetch(path)
          if (!response.ok) continue

          const words = parseWordList(await response.text())
          if (words.length && !cancelled) {
            setEnglishGuessWords(words)
            setDictionaryLoaded(true)
            return
          }
        } catch {
          // Keep the small fallback list if the static dictionary is unavailable.
        }
      }
    }

    loadDictionary()
    return () => { cancelled = true }
  }, [])

  const submitGuess = (event) => {
    event.preventDefault()
    const guess = currentGuess.toUpperCase()
    if (isWon || isLost) return
    if (guess.length !== answer.length) {
      setMessage(`Le mot doit contenir ${answer.length} lettres.`)
      return
    }
    if (!validGuesses.has(guess)) {
      setMessage('Mot non valide. Utilise un mot anglais autorise ou un mot de la liste EGC.')
      return
    }
    if (guesses.includes(guess)) {
      setMessage('Mot deja essaye.')
      return
    }

    const nextGuesses = [...guesses, guess]
    setGuesses(nextGuesses)
    setCurrentGuess('')

    if (guess === answer) {
      setMessage('Bravo, mot trouve !')
      setTimeout(() => showSuccess({ title: 'Mot trouve !', copy: `${answer} - ${nextGuesses.length} essais - +5 points`, action: () => go('ranking'), actionLabel: 'Voir le classement' }), 450)
    } else if (nextGuesses.length >= 6) {
      setMessage(`Perdu. Le mot etait ${answer}.`)
    } else {
      setMessage(`${6 - nextGuesses.length} essais restants.`)
    }
  }

  const resetGame = () => {
    setGuesses([])
    setCurrentGuess('')
    setMessage('Nouveau mot charge.')
    setWordIndex((index) => playableWords.length ? (index + 1) % playableWords.length : 0)
  }

  const rows = Array.from({ length: 6 }, (_, index) => {
    if (guesses[index]) return guesses[index]
    if (index === guesses.length && !isWon && !isLost) return currentGuess.padEnd(answer.length, ' ')
    return ' '.repeat(answer.length)
  })

  return (
    <div className="wordle-layout fade-enter">
      <div className="panel wordle-panel">
        <div className="panel-header"><div><Pill>WORDLE EGC</Pill><h3>Mot de {answer.length} lettres</h3><p>{message}</p></div><span className="timer">{guesses.length}/6 essais</span></div>
        <div className="wordle-board">
          {rows.map((row, rowIndex) => (
            <div className="wordle-row" key={`${rowIndex}-${row}`}>
              {row.split('').map((letter, index) => <Tile key={`${rowIndex}-${index}`} value={letter.trim()} status={guesses[rowIndex] ? scoreGuess(row, answer)[index] : ''} />)}
            </div>
          ))}
        </div>
        <form className="wordle-form" onSubmit={submitGuess}>
          <input value={currentGuess} disabled={isWon || isLost} onChange={(event) => setCurrentGuess(event.target.value.replace(/[^a-zA-Z]/g, '').slice(0, answer.length).toUpperCase())} maxLength={answer.length} placeholder={answer.replace(/[A-Z]/g, '_')} />
          <Button type="submit" disabled={isWon || isLost}>Valider</Button>
          <Button type="button" variant="secondary" onClick={resetGame}>Nouveau mot</Button>
        </form>
      </div>
      <div className="side-stack">
        <div className="score-panel"><h3>Ta progression</h3><strong>245</strong><p>points au total</p><div className="ranking-mini"><b>#4</b><span>au classement</span></div><div className="score-orb" /></div>
        <div className="panel help-panel"><h3>Comment jouer</h3><Legend tone="correct" text="Bonne lettre, bonne position" /><Legend tone="present" text="Bonne lettre, mauvaise position" /><Legend tone="absent" text="Lettre absente du mot" /><p className="wordle-answer-hint">Les essais valides doivent etre dans la banque EGC ou dans le dictionnaire anglais {dictionaryLoaded ? 'charge depuis words.txt' : 'en cours de chargement'}.</p></div>
      </div>
    </div>
  )
}

function scoreGuess(guess, answer) {
  const result = Array.from({ length: answer.length }, () => 'absent delayed')
  const remaining = {}

  for (let index = 0; index < answer.length; index += 1) {
    const answerLetter = answer[index]
    const guessLetter = guess[index]
    if (guessLetter === answerLetter) {
      result[index] = 'correct delayed'
    } else {
      remaining[answerLetter] = (remaining[answerLetter] || 0) + 1
    }
  }

  for (let index = 0; index < answer.length; index += 1) {
    const guessLetter = guess[index]
    if (result[index] === 'correct delayed') continue
    if (remaining[guessLetter] > 0) {
      result[index] = 'present delayed'
      remaining[guessLetter] -= 1
    }
  }

  return result
}

function Tile({ value = '', status = '' }) { return <span className={`tile ${status}`}>{value}</span> }
function Legend({ tone, text }) { return <div className="legend"><i className={tone} />{text}</div> }
function Detail({ label, text }) { return <div className="detail"><small>{label}</small><span>{text}</span></div> }
function Field({ label, placeholder, required = false, value, onChange, type: fieldType }) {
  const name = label === 'Nom complet' ? 'name' : label === 'Adresse e-mail' ? 'email' : label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const type = fieldType || (label === 'Adresse e-mail' ? 'email' : 'text')
  return <label className="field"><span>{label}</span><input name={name} type={type} placeholder={placeholder} required={required} value={value} onChange={onChange} /></label>
}

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submitLogin = (event) => {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()
    const knownMember = initialMembers.find((member) => member.email.toLowerCase() === email)
    const cleanName = form.name.trim() || knownMember?.name || email.split('@')[0] || 'Membre EGC'
    onLogin({ name: cleanName, email, role: knownMember?.role || 'Membre' })
  }

  return (
    <main className="login-shell">
      <section className="login-showcase">
        <div className="login-logo-stage"><img src="/assets/logo/cosmoticFull_logo.PNG" alt="EGC" /></div>
        <div>
          <Pill tone="gold">ENSAT GAMING CLUB</Pill>
          <h1>Connecte-toi a ton espace EGC.</h1>
        <p>Accede aux evenements, tournois, activites et a ton espace membre.</p>
        </div>
      </section>
      <form className="login-panel" onSubmit={submitLogin}>
        <img className="login-logo" src="/assets/logo/DarkLogo.PNG" alt="EGC" />
        <h2>Connexion</h2>
        <p>Prototype local, aucun backend n est encore branche.</p>
        <Field required label="Nom complet" value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="Mohamed Boustani" />
        <Field required label="Adresse e-mail" value={form.email} onChange={(event) => updateForm('email', event.target.value)} placeholder="membre@egc.ma" />
        <Field required label="Mot de passe" type="password" value={form.password} onChange={(event) => updateForm('password', event.target.value)} placeholder="********" />
        <Button type="submit">Se connecter</Button>
      </form>
    </main>
  )
}

function Ranking({ go }) {
  const [period, setPeriod] = useState('monthly')
  const rows = period === 'monthly' ? players : weeklyPlayers

  return (
    <>
      <PageHeader eyebrow="Classement" title={period === 'monthly' ? 'Top joueurs - juillet' : 'Top joueurs - cette semaine'} lead="Les points se gagnent avec le Wordle, les tournois et les series."><div className="filter-row ranking-switch"><button className={`tab ${period === 'monthly' ? 'active' : ''}`} onClick={() => setPeriod('monthly')}>MENSUEL</button><button className={`tab ${period === 'weekly' ? 'active' : ''}`} onClick={() => setPeriod('weekly')}>HEBDOMADAIRE</button></div></PageHeader>
      <section className="section"><div className="container ranking-layout">
        <div className="panel ranking-table fade-enter"><div className="table-head"><span>RANG</span><span>JOUEUR</span><span>POINTS</span></div>{rows.map(([rank, name, initial, points, tone]) => <div key={`${period}-${rank}`} className={`player ${name.includes('Mohamed') ? 'current' : ''}`}><b className={`place ${tone}`}>{rank}</b><span className="player-name"><i className={`avatar ${tone}`}>{initial}</i>{name}</span><strong>{points}</strong></div>)}</div>
        <div className="side-stack"><div className="score-panel ranking-card"><h3>Ton score</h3><strong>{period === 'monthly' ? '245 pts' : '61 pts'}</strong><p>{period === 'monthly' ? '+ 18 pts cette semaine' : '#4 cette semaine'}</p><Button variant="secondary" onClick={() => go('activities')}>Voir mes activites</Button><div className="score-orb" /></div><div className="panel streak-card"><h3>Serie active</h3><b>4 jours</b><p>Encore 1 jour pour gagner le bonus de 5 points.</p><div className="progress"><i /></div><Pill tone="gold">PROCHAIN BONUS +5</Pill></div></div>
      </div></section>
    </>
  )
}

function Admin({ toast, events, setEvents, tournaments, setTournaments, wordBank, setWordBank }) {
  const [active, setActive] = useState('overview')
  const [collapsed, setCollapsed] = useState(false)
  const [motion, setMotion] = useState('boost')
  const [members, setMembers] = useState(initialMembers)
  const [query, setQuery] = useState('')
  const [newMemberOpen, setNewMemberOpen] = useState(false)
  const [requestRows, setRequestRows] = useState([
    { name: 'gamer_ensat', launcher: 'TLauncher', status: 'En attente' },
    { name: 'nour_play', launcher: 'Officiel', status: 'En attente' },
    { name: 'ayoub10', launcher: 'TLauncher', status: 'Acceptee' },
  ])
  const [wordInput, setWordInput] = useState('')

  const filteredMembers = useMemo(() => members.filter((member) => `${member.name} ${member.email}`.toLowerCase().includes(query.toLowerCase())), [members, query])
  const changeRequest = (name, status) => setRequestRows((rows) => rows.map((row) => row.name === name ? { ...row, status } : row))
  const removeMember = (name) => { setMembers((rows) => rows.filter((member) => member.name !== name)); toast({ title: 'Membre supprime', copy: `${name} a ete retire de la liste.` }) }
  const createMember = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    if (!name || !email) return
    setMembers((rows) => [...rows, { name, email, role: 'Membre', points: 0, status: 'Invite' }])
    event.currentTarget.reset()
    setNewMemberOpen(false)
    toast({ title: 'Membre cree', copy: `Les identifiants temporaires de ${name} sont prets a etre transmis.` })
  }
  const addWord = () => {
    const word = wordInput.trim().toUpperCase()
    if (!word || word.length < 3 || wordBank.includes(word)) return
    setWordBank((rows) => [...rows, word])
    setWordInput('')
    toast({ title: 'Mot ajoute', copy: `${word} rejoint la banque Wordle.` })
  }

  return (
    <>
      <PageHeader eyebrow="Administration" title="Piloter la communaute EGC" lead="Gere les membres, le Wordle, les evenements, les tournois et les demandes Minecraft." />
      <section className={`section admin-section motion-${motion}`}><div className="container"><div className={`admin-shell ${collapsed ? 'is-collapsed' : ''}`}>
        <aside className="admin-sidebar"><div className="admin-brand"><span>EGC</span><i>G</i><button onClick={() => setCollapsed((value) => !value)} title={collapsed ? 'Afficher le menu' : 'Reduire le menu'}>{collapsed ? '>' : '<'}</button></div><Pill tone="gold">ADMIN</Pill><nav>{adminTabs.map((item) => <button key={item.id} onClick={() => setActive(item.id)} className={active === item.id ? 'active' : ''}><b>{item.icon}</b><span>{item.label}</span></button>)}</nav><div className="sidebar-footer"><span className="pulse-dot" /> Systeme operationnel</div></aside>
        <div className="admin-content"><div className="admin-top"><div><p className="eyebrow">{adminTabs.find((item) => item.id === active)?.label}</p><h2>{active === 'overview' ? 'Tableau de bord' : adminTabs.find((item) => item.id === active)?.label}</h2><p>Juillet 2026 - Donnees de demonstration interactives</p></div><div className="admin-actions"><button className={`motion-control ${motion === 'boost' ? 'active' : ''}`} onClick={() => setMotion(motion === 'boost' ? 'soft' : 'boost')}>{motion === 'boost' ? '* Effets boostes' : 'o Effets doux'}</button><Button onClick={() => setNewMemberOpen(true)}>Creer un membre</Button></div></div>
          {active === 'overview' && <Overview setActive={setActive} events={events} tournaments={tournaments} />}
          {active === 'members' && <Members rows={filteredMembers} query={query} setQuery={setQuery} onRemove={removeMember} />}
          {active === 'wordle' && <WordleAdmin words={wordBank} wordInput={wordInput} setWordInput={setWordInput} addWord={addWord} setWordBank={setWordBank} />}
          {active === 'events' && <EventsAdmin rows={events} setRows={setEvents} toast={toast} />}
          {active === 'tournaments' && <TournamentsAdmin tournaments={tournaments} setTournaments={setTournaments} toast={toast} />}
          {active === 'minecraft' && <MinecraftAdmin rows={requestRows} changeRequest={changeRequest} />}
        </div>
      </div></div></section>
      <Modal open={newMemberOpen} onClose={() => setNewMemberOpen(false)}><button className="modal-close" onClick={() => setNewMemberOpen(false)}>x</button><div className="modal-symbol">+</div><h2>Creer un membre</h2><p>Un mot de passe temporaire sera genere apres la creation du compte.</p><form className="modal-form" onSubmit={createMember}><Field required label="Nom complet" placeholder="Nom du membre" /><Field required label="Adresse e-mail" placeholder="prenom@etu.uae.ac.ma" /><div className="modal-actions"><Button type="submit">Creer le compte</Button><Button type="button" variant="secondary" onClick={() => setNewMemberOpen(false)}>Annuler</Button></div></form></Modal>
    </>
  )
}

function Overview({ setActive, events, tournaments }) {
  const upcomingCount = events.filter((event) => event.status !== 'Passe').length
  const activeTournament = tournaments.find((tournament) => tournament.status === 'Actif') || tournaments[0]
  const metrics = [['Membres actifs', '128', '+12 ce mois'], ['Parties Wordle', '874', '68% de reussite'], ['Tournoi en cours', activeTournament?.title || 'Aucun', `${activeTournament?.registered || 0} inscrits`], ['Evenements a venir', String(upcomingCount), events.find((event) => event.isSignupOpen)?.title || 'A ouvrir']]
  const bars = [70, 114, 92, 158, 126, 188, 170]

  return <div className="admin-view fade-enter"><div className="metrics">{metrics.map(([label, value, caption], index) => <article className="metric reveal-card" key={label} style={{ '--delay': `${index * 70}ms` }}><small>{label}</small><strong>{value}</strong><em>{caption}</em><i className="metric-shine" /></article>)}</div><div className="dash-grid"><article className="admin-card chart-card"><header><h3>Activite des 7 derniers jours</h3><Pill tone="success">+18%</Pill></header><div className="bar-chart">{bars.map((height, index) => <span key={index} style={{ '--height': `${height}px`, '--delay': `${index * 80}ms` }}><i /><b>{['L', 'M', 'M', 'J', 'V', 'S', 'D'][index]}</b></span>)}</div></article><article className="admin-card quick-card"><h3>Actions rapides</h3><Button variant="ghost" onClick={() => setActive('members')}>MB Gerer les membres</Button><Button variant="ghost" onClick={() => setActive('wordle')}>WD Ajouter un mot Wordle</Button><Button variant="ghost" onClick={() => setActive('events')}>EV Creer un evenement</Button><Button onClick={() => setActive('tournaments')}>TR Nouveau tournoi</Button></article></div><article className="admin-card mini-requests"><header><h3>Dernieres demandes Minecraft</h3><Button variant="secondary" onClick={() => setActive('minecraft')}>Voir tout</Button></header>{[['gamer_ensat', 'TLauncher', 'En attente'], ['nour_play', 'Officiel', 'En attente'], ['ayoub10', 'TLauncher', 'Acceptee']].map(([name, launcher, status]) => <div className="request-row" key={name}><b>{name}</b><span>{launcher}</span><Pill tone={status === 'Acceptee' ? 'success' : 'warning'}>{status}</Pill></div>)}</article></div>
}

function Members({ rows, query, setQuery, onRemove }) {
  return <div className="admin-view fade-enter"><div className="toolbar"><div><h3>Membres de la communaute</h3><p>Creation, gestion des roles et suivi des points.</p></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un membre..." /></div><div className="admin-card data-table"><div className="data-head"><span>MEMBRE</span><span>ROLE</span><span>POINTS</span><span>STATUT</span><span /></div>{rows.map((member) => <div className="data-row" key={member.email}><span className="member-cell"><i>{member.name[0]}</i><b>{member.name}<small>{member.email}</small></b></span><Pill tone={member.role === 'Admin' ? 'purple' : 'muted'}>{member.role}</Pill><strong>{member.points}</strong><Pill tone={member.status === 'Actif' ? 'success' : 'warning'}>{member.status}</Pill><button className="row-action danger" onClick={() => onRemove(member.name)}>Retirer</button></div>)}</div></div>
}

function WordleAdmin({ words, wordInput, setWordInput, addWord, setWordBank }) {
  return <div className="admin-view fade-enter"><div className="wordle-admin-grid"><article className="admin-card schedule-card"><p className="eyebrow">Publication locale</p><h3>Banque active du prototype</h3><div className="today-word"><span>{words.length}</span><strong>{words[0] || 'ARENA'}</strong><Pill tone="success">Pret</Pill></div><div className="schedule-line"><span className="line-dot" /><div><b>Sans backend</b><p>Les mots ajoutes ici alimentent directement le Wordle de la page Activites. Leur longueur peut changer.</p></div></div></article><article className="admin-card word-bank"><h3>Banque de mots</h3><p>Ajoute des mots gaming de 3 lettres ou plus.</p><div className="add-word"><input value={wordInput} onChange={(event) => setWordInput(event.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 12).toUpperCase())} maxLength="12" placeholder="VALORANT" /><Button onClick={addWord}>Ajouter</Button></div><div className="word-list">{words.map((word, index) => <span key={word} style={{ '--delay': `${index * 55}ms` }}>{word}<button disabled={words.length <= 1} onClick={() => setWordBank((items) => items.filter((item) => item !== word))}>x</button></span>)}</div></article></div></div>
}

function EventsAdmin({ rows, setRows, toast }) {
  const [form, setForm] = useState(emptyEventForm)
  const [editingId, setEditingId] = useState(null)

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const resetForm = () => {
    setForm(emptyEventForm)
    setEditingId(null)
  }
  const saveEvent = (event) => {
    event.preventDefault()
    const title = form.title.trim()
    if (!title) return
    const payload = {
      ...form,
      id: editingId || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `event-${Date.now()}`,
      title,
      date: form.date.trim() || 'Date a definir',
      venue: form.venue.trim() || 'Lieu a definir',
      details: form.details.trim() || 'Infos a completer par l admin.',
      rules: form.rules.trim() || 'Regles a definir.',
      postUrl: form.postUrl.trim() || '#',
      imageUrl: form.imageUrl || makeGameImage(title.slice(0, 10).toUpperCase(), '#1E50B4', '#0D0D1A'),
      isSignupOpen: editingId ? rows.find((row) => row.id === editingId)?.isSignupOpen || false : false,
    }
    setRows((items) => editingId ? items.map((item) => item.id === editingId ? payload : item) : [...items, payload])
    toast({ title: editingId ? 'Evenement modifie' : 'Evenement cree', copy: `${payload.title} est pret.` })
    resetForm()
  }
  const editEvent = (event) => {
    setEditingId(event.id)
    setForm({
      title: event.title,
      date: event.date,
      venue: event.venue,
      status: event.status,
      imageUrl: event.imageUrl || '',
      category: event.category || '',
      details: event.details || '',
      rules: event.rules || '',
      postUrl: event.postUrl || '',
    })
  }
  const openSignup = (id) => setRows((items) => items.map((item) => ({ ...item, isSignupOpen: item.id === id && item.status !== 'Passe' })))

  return <div className="admin-view fade-enter"><form className="admin-card admin-form-grid" onSubmit={saveEvent}><div><h3>{editingId ? 'Modifier evenement' : 'Ajouter evenement'}</h3><p>Les changements apparaissent directement dans la page Evenements.</p></div><Field required label="Titre" value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="Nom de l evenement" /><Field label="Date" value={form.date} onChange={(event) => updateForm('date', event.target.value)} placeholder="20 juillet - 14:00" /><Field label="Lieu" value={form.venue} onChange={(event) => updateForm('venue', event.target.value)} placeholder="ENSAT Arena" /><label className="field"><span>Statut</span><select value={form.status} onChange={(event) => updateForm('status', event.target.value)}><option>A venir</option><option>Passe</option><option>Brouillon</option></select></label><Field label="Categorie" value={form.category} onChange={(event) => updateForm('category', event.target.value)} placeholder="FPS, Sport gaming..." /><Field label="Image URL" value={form.imageUrl} onChange={(event) => updateForm('imageUrl', event.target.value)} placeholder="https://..." /><label className="field"><span>Choisir image</span><input type="file" accept="image/*" onChange={(event) => readImageFile(event, (imageUrl) => updateForm('imageUrl', imageUrl))} /></label><Field label="Post URL" value={form.postUrl} onChange={(event) => updateForm('postUrl', event.target.value)} placeholder="Lien du post" />{form.imageUrl && <div className="image-preview wide"><img src={form.imageUrl} alt="" /></div>}<label className="field wide"><span>Infos</span><textarea value={form.details} onChange={(event) => updateForm('details', event.target.value)} placeholder="Details affiches au clic sur Infos" /></label><label className="field wide"><span>Regles</span><textarea value={form.rules} onChange={(event) => updateForm('rules', event.target.value)} placeholder="Conditions, format, materiel..." /></label><div className="form-actions wide"><Button type="submit">{editingId ? 'Enregistrer' : 'Ajouter'}</Button><Button type="button" variant="secondary" onClick={resetForm}>Annuler</Button></div></form><div className="event-admin-list">{rows.map((event) => <article key={event.id} className="admin-card event-admin-row"><div className="event-thumbnail image-thumb"><img src={event.imageUrl || makeGameImage('EGC', '#1E50B4', '#0D0D1A')} alt="" /></div><div><h3>{event.title}</h3><p>{event.date} - {event.venue}</p></div><Pill tone={event.status === 'A venir' ? 'blue' : event.status === 'Passe' ? 'muted' : 'warning'}>{event.status}</Pill><div className="event-actions"><Button variant="secondary" onClick={() => editEvent(event)}>Modifier</Button><Button variant={event.isSignupOpen ? 'success' : 'ghost'} onClick={() => openSignup(event.id)} disabled={event.status === 'Passe'}>{event.isSignupOpen ? 'Inscription active' : 'Activer inscription'}</Button><Button variant="danger" onClick={() => setRows((items) => items.filter((item) => item.id !== event.id))}>Supprimer</Button></div></article>)}</div></div>
}

function TournamentsAdmin({ tournaments, setTournaments, toast }) {
  const [form, setForm] = useState(emptyTournamentForm)
  const [editingId, setEditingId] = useState(null)

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const resetForm = () => {
    setForm(emptyTournamentForm)
    setEditingId(null)
  }
  const saveTournament = (event) => {
    event.preventDefault()
    const title = form.title.trim()
    if (!title) return
    const payload = {
      ...form,
      id: editingId || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `tournoi-${Date.now()}`,
      title,
      game: form.game.trim() || 'Jeu a definir',
      date: form.date.trim() || 'Date a definir',
      capacity: Math.max(1, Number(form.capacity) || 1),
      registered: Math.max(0, Number(form.registered) || 0),
      format: form.format.trim() || 'Format a definir',
      reward: form.reward.trim() || 'Recompense a definir',
      imageUrl: form.imageUrl || makeGameImage(title.slice(0, 10).toUpperCase(), '#7C3AED', '#11122c'),
    }
    payload.registered = Math.min(payload.registered, payload.capacity)
    setTournaments((items) => editingId ? items.map((item) => item.id === editingId ? payload : item) : [...items, payload])
    toast({ title: editingId ? 'Tournoi modifie' : 'Tournoi ajoute', copy: `${payload.title} est enregistre.` })
    resetForm()
  }
  const editTournament = (tournament) => {
    setEditingId(tournament.id)
    setForm(tournament)
  }

  return <div className="admin-view fade-enter"><div className="tournament-admin"><form className="admin-card tournament-control" onSubmit={saveTournament}><p className="eyebrow">{editingId ? 'Edition tournoi' : 'Nouveau tournoi'}</p><Field required label="Titre" value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="Valorant Duo Bracket" /><Field label="Jeu" value={form.game} onChange={(event) => updateForm('game', event.target.value)} placeholder="Valorant" /><Field label="Date" value={form.date} onChange={(event) => updateForm('date', event.target.value)} placeholder="Samedi - 18:00" /><div className="tournament-form"><label>Places<input type="number" min="1" value={form.capacity} onChange={(event) => updateForm('capacity', Number(event.target.value) || 1)} /></label><label>Inscrits<input type="number" min="0" value={form.registered} onChange={(event) => updateForm('registered', Number(event.target.value) || 0)} /></label></div><Field label="Format" value={form.format} onChange={(event) => updateForm('format', event.target.value)} placeholder="Duo - Elimination directe" /><Field label="Recompense" value={form.reward} onChange={(event) => updateForm('reward', event.target.value)} placeholder="60 pts" /><Field label="Image URL" value={form.imageUrl || ''} onChange={(event) => updateForm('imageUrl', event.target.value)} placeholder="https://..." /><label className="field"><span>Choisir image</span><input type="file" accept="image/*" onChange={(event) => readImageFile(event, (imageUrl) => updateForm('imageUrl', imageUrl))} /></label>{form.imageUrl && <div className="image-preview"><img src={form.imageUrl} alt="" /></div>}<label className="field"><span>Statut</span><select value={form.status} onChange={(event) => updateForm('status', event.target.value)}><option>Brouillon</option><option>Actif</option><option>Termine</option></select></label><div className="form-actions"><Button type="submit">{editingId ? 'Enregistrer' : 'Ajouter tournoi'}</Button><Button type="button" variant="secondary" onClick={resetForm}>Annuler</Button></div></form><article className="admin-card participants"><h3>Tournois</h3>{tournaments.map((tournament) => <div className="tournament-row" key={tournament.id}><img src={tournament.imageUrl || makeGameImage('TOURNOI', '#7C3AED', '#11122c')} alt="" /><div><b>{tournament.title}</b><span>{tournament.game} - {tournament.date}</span><small>{tournament.registered}/{tournament.capacity} inscrits - {tournament.status}</small></div><div className="row-buttons"><Button variant="secondary" onClick={() => editTournament(tournament)}>Modifier</Button><Button variant="danger" onClick={() => setTournaments((items) => items.filter((item) => item.id !== tournament.id))}>Supprimer</Button></div></div>)}</article></div></div>
}

function MinecraftAdmin({ rows, changeRequest }) {
  return <div className="admin-view fade-enter"><div className="toolbar"><div><h3>Demandes d'acces Minecraft</h3><p>Accepte, refuse ou conserve les demandes en attente.</p></div><Pill tone="warning">{rows.filter((row) => row.status === 'En attente').length} A TRAITER</Pill></div><div className="admin-card minecraft-table"><div className="data-head"><span>PSEUDO</span><span>LAUNCHER</span><span>STATUT</span><span>ACTIONS</span></div>{rows.map((row) => <div className="data-row" key={row.name}><b>{row.name}</b><span>{row.launcher}</span><Pill tone={row.status === 'Acceptee' ? 'success' : row.status === 'Refusee' ? 'danger' : 'warning'}>{row.status}</Pill><div className="row-buttons"><Button variant="success" onClick={() => changeRequest(row.name, 'Acceptee')}>Accepter</Button><Button variant="danger" onClick={() => changeRequest(row.name, 'Refusee')}>Refuser</Button></div></div>)}</div></div>
}

function SuccessOverlay({ success, close }) {
  if (!success) return null

  return <div className="success-overlay"><div className="success-card"><span className="confetti c1" /><span className="confetti c2" /><span className="confetti c3" /><span className="confetti c4" /><div className="success-symbol">OK</div><h2>{success.title}</h2><p>{success.copy}</p><div><Button onClick={() => { close(); success.action?.() }}>{success.actionLabel || 'Continuer'}</Button><Button variant="secondary" onClick={close}>Fermer</Button></div></div></div>
}

export default function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('home')
  const [navOpen, setNavOpen] = useState(false)
  const [events, setEvents] = useState(initialEvents)
  const [tournaments, setTournaments] = useState(initialTournaments)
  const [wordBank, setWordBank] = useState(initialWords)
  const [signupEvent, setSignupEvent] = useState(null)
  const [success, setSuccess] = useState(null)
  const [toastState, setToastState] = useState(null)

  const toast = (payload) => {
    setToastState(payload)
    window.clearTimeout(window.__egcToast)
    window.__egcToast = window.setTimeout(() => setToastState(null), 3600)
  }
  const go = (target) => {
    setPage(target)
    setNavOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const openSignup = (event) => {
    if (!event?.isSignupOpen) return
    setSignupEvent(event)
  }
  const visibleNavItems = user?.role === 'Admin' ? navItems : navItems.filter((item) => item.id !== 'admin')

  if (!user) {
    return <LoginPage onLogin={(profile) => { setUser(profile); setPage(profile.role === 'Admin' ? 'admin' : 'home') }} />
  }

  return (
    <div className="app-shell">
      <nav className="site-nav">
        <button className="brand" onClick={() => go('home')} aria-label="Retour a l'accueil"><img src="/assets/logo/DarkLogo.PNG" alt="EGC" /></button>
        <button className={`menu-toggle ${navOpen ? 'active' : ''}`} onClick={() => setNavOpen((value) => !value)} aria-expanded={navOpen} aria-controls="site-links"><span />Menu</button>
        <div id="site-links" className={`site-links ${navOpen ? 'is-open' : ''}`}>
          {visibleNavItems.map((item) => <button key={item.id} onClick={() => go(item.id)} className={page === item.id ? 'active' : ''} aria-current={page === item.id ? 'page' : undefined}><span>{item.icon}</span>{item.label}</button>)}
          <button className="logout-btn menu-logout" onClick={() => { setUser(null); setPage('home'); setNavOpen(false) }}><span>LO</span>Logout</button>
        </div>
        <button className="profile-btn" onClick={() => go('activities')}><i>*</i> {user.name}</button>
      </nav>
      <main className="page-swap" key={page}>
        {page === 'home' && <Home go={go} />}
        {page === 'events' && <Events events={events} openSignup={openSignup} />}
        {page === 'activities' && <Activities go={go} showSuccess={setSuccess} toast={toast} wordBank={wordBank} tournaments={tournaments} />}
        {page === 'ranking' && <Ranking go={go} />}
        {page === 'admin' && <Admin toast={toast} events={events} setEvents={setEvents} tournaments={tournaments} setTournaments={setTournaments} wordBank={wordBank} setWordBank={setWordBank} />}
      </main>
      <Modal open={Boolean(signupEvent)} onClose={() => setSignupEvent(null)}><button className="modal-close" onClick={() => setSignupEvent(null)}>x</button><div className="modal-symbol">-&gt;</div><h2>{signupEvent ? `Inscription - ${signupEvent.title}` : 'Inscription'}</h2><p>Le formulaire d'inscription s'ouvre dans un nouvel onglet. Aucune donnee ne sera enregistree directement par EGC.</p><div className="modal-actions"><Button onClick={() => { setSignupEvent(null); toast({ title: 'Formulaire externe', copy: "Simulation : redirection vers le formulaire d'inscription." }) }}>Ouvrir le formulaire</Button><Button variant="secondary" onClick={() => setSignupEvent(null)}>Retour aux evenements</Button></div></Modal>
      <SuccessOverlay success={success} close={() => setSuccess(null)} />
      <Toast toast={toastState} />
    </div>
  )
}
