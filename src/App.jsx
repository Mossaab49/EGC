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

const eventsSeed = [
  { title: 'FIFA 2v2 - Summer Cup', date: '20 juillet - 14:00', venue: 'ENSAT Arena', color: 'blue', status: 'A venir' },
  { title: 'Valorant - Campus Clash', date: '02 aout - 10:00', venue: 'Amphi ENSAT', color: 'purple', status: 'A venir' },
  { title: 'FAR des Clubs', date: '16 aout - 16:00', venue: 'Terrain ENSAT', color: 'gold', status: 'A venir' },
]

const players = [
  ['1', 'Yassine Amrani', 'Y', 380, 'gold'],
  ['2', 'Salma Rami', 'S', 352, 'purple'],
  ['3', 'Omar Lahlou', 'O', 331, 'blue'],
  ['4', 'Mohamed B.', 'M', 245, 'blue'],
  ['5', 'Sara Benali', 'S', 228, 'slate'],
]

function Button({ children, variant = 'primary', className = '', ...props }) {
  return <button className={`btn ${variant} ${className}`} {...props}>{children}</button>
}

function Pill({ children, tone = 'blue' }) {
  return <span className={`pill ${tone}`}>{children}</span>
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

function EventCard({ event, onSignup }) {
  return (
    <article className="event-card reveal-card">
      <div className={`event-cover cover-${event.color}`}>
        <Pill tone="gold">{event.status}</Pill>
        <div className="cover-orbit" />
      </div>
      <div className="event-content">
        <h3>{event.title}</h3>
        <p>{event.date} - {event.venue}</p>
        <Button onClick={onSignup}>S'inscrire <span>-&gt;</span></Button>
      </div>
    </article>
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

function Home({ go, events, openSignup }) {
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
              <span className="console-badge">Saison 2026</span>
              <strong>EGC</strong><p>PLAY.<br />COMPETE.<br />BELONG.</p>
              <div className="console-grid" />
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><p className="eyebrow">A ne pas manquer</p><h2>Prochains rendez-vous</h2></div>
            <p>Des experiences concues par et pour la communaute EGC.</p>
          </div>
          <div className="card-grid">{events.map((event) => <EventCard key={event.title} event={event} onSignup={openSignup} />)}</div>
          <div className="section-note"><strong>01</strong><span>Evenements ouverts au public - Inscription via formulaire externe</span></div>
        </div>
      </section>
    </>
  )
}

function Events({ events, openSignup }) {
  return (
    <>
      <PageHeader eyebrow="Evenements" title="Competitions & grands evenements" lead="Rejoins les rendez-vous qui font vivre le gaming a l'ENSAT.">
        <div className="filter-row"><Pill>3 A VENIR</Pill><Pill tone="muted">2 PASSES</Pill></div>
      </PageHeader>
      <section className="section"><div className="container">
        <div className="card-grid">{events.map((event) => <EventCard key={event.title} event={event} onSignup={openSignup} />)}</div>
        <div className="archive-block">
          <p className="eyebrow">Archives</p><h2>Evenements passes</h2>
          <div className="card-grid">
            <EventCard event={{ title: 'Rocket League Night', date: '12 juin - 18:00', venue: 'Salle B12', color: 'navy', status: 'Termine' }} onSignup={openSignup} />
            <EventCard event={{ title: 'Tournoi inter-ENSA', date: '25 mai - 09:00', venue: 'ENSAT', color: 'blue', status: 'Termine' }} onSignup={openSignup} />
          </div>
        </div>
      </div></section>
    </>
  )
}

function Activities({ go, showSuccess, toast }) {
  const [tab, setTab] = useState('wordle')
  const [wordleWon, setWordleWon] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [minecraftSent, setMinecraftSent] = useState(false)
  const word = ['P', 'L', 'A', 'Y', '!']

  const playWordle = () => {
    setWordleWon(true)
    setTimeout(() => showSuccess({ title: 'Mot trouve !', copy: 'PLAY - 2 essais - +5 points - Serie de 5 jours', action: () => go('ranking'), actionLabel: 'Voir le classement' }), 680)
  }

  return (
    <>
      <PageHeader eyebrow="Espace membre" title="Activites EGC" lead="Joue chaque jour, participe aux tournois et construis ta progression dans la communaute.">
        <div className="tabs">{[['wordle', 'Wordle EGC'], ['tournament', 'Tournoi hebdomadaire'], ['minecraft', 'Serveur Minecraft']].map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`tab ${tab === id ? 'active' : ''}`}>{label}</button>)}</div>
      </PageHeader>
      <section className="section compact"><div className="container">
        {tab === 'wordle' && <div className="wordle-layout fade-enter">
          <div className="panel wordle-panel">
            <div className="panel-header"><div><Pill>JOUR 42</Pill><h3>Mot de 5 lettres</h3><p>Essai 2 sur 6 - Serie : 4 jours</p></div><span className="timer">Temps restant - 19:41:26</span></div>
            <div className="wordle-board">
              <div className="wordle-row"><Tile value="C" status="present" /><Tile value="R" status="absent" /><Tile value="A" status="correct" /><Tile value="N" status="absent" /><Tile value="E" status="absent" /></div>
              <div className="wordle-row">{word.map((letter) => <Tile key={letter} value={wordleWon ? letter : ''} status={wordleWon ? 'correct delayed' : ''} />)}</div>
              {[0, 1, 2, 3].map((row) => <div className="wordle-row" key={row}>{Array.from({ length: 5 }).map((_, index) => <Tile key={index} />)}</div>)}
            </div>
            <Button onClick={playWordle}>{wordleWon ? 'OK Mot trouve' : 'Jouer maintenant'} <span>*</span></Button>
          </div>
          <div className="side-stack">
            <div className="score-panel"><h3>Ta progression</h3><strong>245</strong><p>points au total</p><div className="ranking-mini"><b>#4</b><span>au classement</span></div><div className="score-orb" /></div>
            <div className="panel help-panel"><h3>Comment jouer</h3><Legend tone="correct" text="Bonne lettre, bonne position" /><Legend tone="present" text="Bonne lettre, mauvaise position" /><Legend tone="absent" text="Lettre absente du mot" /></div>
          </div>
        </div>}
        {tab === 'tournament' && <div className="tournament-layout fade-enter">
          <div className="tournament-banner"><Pill tone="gold">TOURNOI HEBDOMADAIRE</Pill><div className="game-stamp">VALORANT</div><h2>Valorant<br />Duo Bracket</h2><p>Samedi 12 juillet - 18:00<br />Inscription avant vendredi 23:59</p><Button variant={registered ? 'success' : 'gold'} onClick={() => { setRegistered(true); showSuccess({ title: 'Inscription confirmee', copy: 'Ton dossard #EGC-024 est reserve. Le lien Discord sera envoye avant le tournoi.', action: () => go('ranking'), actionLabel: 'Voir le classement' }) }}>{registered ? 'OK Inscription confirmee' : "S'inscrire au tournoi"}</Button><small>24 places - 12 joueurs inscrits</small></div>
          <div className="panel details-panel"><h3>Infos du tournoi</h3><Detail label="Format" text="Duo - Elimination directe" /><Detail label="Recompense" text="60 pts pour la premiere place" /><Detail label="Serveur" text="Discord EGC - #tournois" /><Detail label="Date limite" text="Vendredi - 23:59" />{registered && <div className="ticket"><strong>OK Inscription confirmee</strong><p>Ton lien Discord sera envoye avant le tournoi.</p><code>DOSSARD #EGC-024</code></div>}</div>
        </div>}
        {tab === 'minecraft' && <div className="minecraft-layout fade-enter">
          <div className="minecraft-banner"><Pill tone="gold">OUVERT AUX MEMBRES</Pill><h2>EGC<br />MINECRAFT</h2><p>Survie - Creation - Evenements<br />Un monde construit ensemble.</p><small>Respect - entraide - fair-play</small></div>
          <form className="panel minecraft-form" onSubmit={(event) => { event.preventDefault(); setMinecraftSent(true); toast({ title: 'Demande envoyee', copy: 'Le responsable Minecraft recevra tes informations.' }) }}><h3>Demander une participation</h3><p>Ta demande sera transmise au responsable du serveur.</p><Field required label="Pseudo Minecraft" placeholder="ex. gamer_ensat" /><Field required label="Launcher utilise" placeholder="ex. TLauncher / officiel" /><Field required label="Nom du compte Aternos" placeholder="ex. EGC-survival" /><label className="check"><input required type="checkbox" /> J'accepte les regles de conduite du serveur.</label><Button type="submit" variant={minecraftSent ? 'success' : 'primary'}>{minecraftSent ? 'OK Demande envoyee' : 'Envoyer la demande'}</Button></form>
        </div>}
      </div></section>
    </>
  )
}

function Tile({ value = '', status = '' }) { return <span className={`tile ${status}`}>{value}</span> }
function Legend({ tone, text }) { return <div className="legend"><i className={tone} />{text}</div> }
function Detail({ label, text }) { return <div className="detail"><small>{label}</small><span>{text}</span></div> }
function Field({ label, placeholder, required = false }) {
  const name = label === 'Nom complet' ? 'name' : label === 'Adresse e-mail' ? 'email' : label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const type = label === 'Adresse e-mail' ? 'email' : 'text'
  return <label className="field"><span>{label}</span><input name={name} type={type} placeholder={placeholder} required={required} /></label>
}

function Ranking({ go }) {
  return (
    <>
      <PageHeader eyebrow="Classement" title="Top joueurs - juillet" lead="Les points se gagnent avec le Wordle, les tournois et les series."><div className="filter-row"><Pill>MENSUEL</Pill><Pill tone="muted">HEBDOMADAIRE</Pill></div></PageHeader>
      <section className="section"><div className="container ranking-layout">
        <div className="panel ranking-table"><div className="table-head"><span>RANG</span><span>JOUEUR</span><span>POINTS</span></div>{players.map(([rank, name, initial, points, tone]) => <div key={rank} className={`player ${rank === '4' ? 'current' : ''}`}><b className={`place ${tone}`}>{rank}</b><span className="player-name"><i className={`avatar ${tone}`}>{initial}</i>{name}</span><strong>{points}</strong></div>)}</div>
        <div className="side-stack"><div className="score-panel ranking-card"><h3>Ton score</h3><strong>245 pts</strong><p>+ 18 pts cette semaine</p><Button variant="secondary" onClick={() => go('activities')}>Voir mes activites</Button><div className="score-orb" /></div><div className="panel streak-card"><h3>Serie active</h3><b>4 jours</b><p>Encore 1 jour pour gagner le bonus de 5 points.</p><div className="progress"><i /></div><Pill tone="gold">PROCHAIN BONUS +5</Pill></div></div>
      </div></section>
    </>
  )
}

function Admin({ toast }) {
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
  const [eventRows, setEventRows] = useState(eventsSeed)
  const [words, setWords] = useState(['PIXEL', 'ARENA', 'CLUTCH', 'SQUAD'])
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
    if (!word || words.includes(word)) return
    setWords((rows) => [...rows, word])
    setWordInput('')
    toast({ title: 'Mot ajoute', copy: `${word} rejoint la banque Wordle.` })
  }

  return (
    <>
      <PageHeader eyebrow="Administration" title="Piloter la communaute EGC" lead="Gere les membres, le Wordle, les evenements, les tournois et les demandes Minecraft." />
      <section className={`section admin-section motion-${motion}`}><div className="container"><div className={`admin-shell ${collapsed ? 'is-collapsed' : ''}`}>
        <aside className="admin-sidebar"><div className="admin-brand"><span>EGC</span><i>G</i><button onClick={() => setCollapsed((value) => !value)} title="Reduire le menu">&lt;</button></div><Pill tone="gold">ADMIN</Pill><nav>{adminTabs.map((item) => <button key={item.id} onClick={() => setActive(item.id)} className={active === item.id ? 'active' : ''}><b>{item.icon}</b><span>{item.label}</span></button>)}</nav><div className="sidebar-footer"><span className="pulse-dot" /> Systeme operationnel</div></aside>
        <div className="admin-content"><div className="admin-top"><div><p className="eyebrow">{adminTabs.find((item) => item.id === active)?.label}</p><h2>{active === 'overview' ? 'Tableau de bord' : adminTabs.find((item) => item.id === active)?.label}</h2><p>Juillet 2026 - Donnees de demonstration interactives</p></div><div className="admin-actions"><button className={`motion-control ${motion === 'boost' ? 'active' : ''}`} onClick={() => setMotion(motion === 'boost' ? 'soft' : 'boost')}>{motion === 'boost' ? '* Effets boostes' : 'o Effets doux'}</button><Button onClick={() => setNewMemberOpen(true)}>Creer un membre</Button></div></div>
          {active === 'overview' && <Overview setActive={setActive} />}
          {active === 'members' && <Members rows={filteredMembers} query={query} setQuery={setQuery} onRemove={removeMember} />}
          {active === 'wordle' && <WordleAdmin words={words} wordInput={wordInput} setWordInput={setWordInput} addWord={addWord} />}
          {active === 'events' && <EventsAdmin rows={eventRows} setRows={setEventRows} toast={toast} />}
          {active === 'tournaments' && <TournamentsAdmin toast={toast} />}
          {active === 'minecraft' && <MinecraftAdmin rows={requestRows} changeRequest={changeRequest} />}
        </div>
      </div></div></section>
      <Modal open={newMemberOpen} onClose={() => setNewMemberOpen(false)}><button className="modal-close" onClick={() => setNewMemberOpen(false)}>x</button><div className="modal-symbol">+</div><h2>Creer un membre</h2><p>Un mot de passe temporaire sera genere apres la creation du compte.</p><form className="modal-form" onSubmit={createMember}><Field required label="Nom complet" placeholder="Nom du membre" /><Field required label="Adresse e-mail" placeholder="prenom@etu.uae.ac.ma" /><div className="modal-actions"><Button type="submit">Creer le compte</Button><Button type="button" variant="secondary" onClick={() => setNewMemberOpen(false)}>Annuler</Button></div></form></Modal>
    </>
  )
}

function Overview({ setActive }) {
  const metrics = [['Membres actifs', '128', '+12 ce mois'], ['Parties Wordle', '874', '68% de reussite'], ['Tournoi en cours', 'Valorant Duo', '12 inscrits'], ['Evenements a venir', '3', 'Prochain : FIFA 2v2']]
  const bars = [70, 114, 92, 158, 126, 188, 170]

  return <div className="admin-view fade-enter"><div className="metrics">{metrics.map(([label, value, caption], index) => <article className="metric reveal-card" key={label} style={{ '--delay': `${index * 70}ms` }}><small>{label}</small><strong>{value}</strong><em>{caption}</em><i className="metric-shine" /></article>)}</div><div className="dash-grid"><article className="admin-card chart-card"><header><h3>Activite des 7 derniers jours</h3><Pill tone="success">+18%</Pill></header><div className="bar-chart">{bars.map((height, index) => <span key={index} style={{ '--height': `${height}px`, '--delay': `${index * 80}ms` }}><i /><b>{['L', 'M', 'M', 'J', 'V', 'S', 'D'][index]}</b></span>)}</div></article><article className="admin-card quick-card"><h3>Actions rapides</h3><Button variant="ghost" onClick={() => setActive('members')}>MB Gerer les membres</Button><Button variant="ghost" onClick={() => setActive('wordle')}>WD Ajouter un mot Wordle</Button><Button variant="ghost" onClick={() => setActive('events')}>EV Creer un evenement</Button><Button onClick={() => setActive('tournaments')}>TR Nouveau tournoi</Button></article></div><article className="admin-card mini-requests"><header><h3>Dernieres demandes Minecraft</h3><Button variant="secondary" onClick={() => setActive('minecraft')}>Voir tout</Button></header>{[['gamer_ensat', 'TLauncher', 'En attente'], ['nour_play', 'Officiel', 'En attente'], ['ayoub10', 'TLauncher', 'Acceptee']].map(([name, launcher, status]) => <div className="request-row" key={name}><b>{name}</b><span>{launcher}</span><Pill tone={status === 'Acceptee' ? 'success' : 'warning'}>{status}</Pill></div>)}</article></div>
}

function Members({ rows, query, setQuery, onRemove }) {
  return <div className="admin-view fade-enter"><div className="toolbar"><div><h3>Membres de la communaute</h3><p>Creation, gestion des roles et suivi des points.</p></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un membre..." /></div><div className="admin-card data-table"><div className="data-head"><span>MEMBRE</span><span>ROLE</span><span>POINTS</span><span>STATUT</span><span /></div>{rows.map((member) => <div className="data-row" key={member.email}><span className="member-cell"><i>{member.name[0]}</i><b>{member.name}<small>{member.email}</small></b></span><Pill tone={member.role === 'Admin' ? 'purple' : 'muted'}>{member.role}</Pill><strong>{member.points}</strong><Pill tone={member.status === 'Actif' ? 'success' : 'warning'}>{member.status}</Pill><button className="row-action danger" onClick={() => onRemove(member.name)}>Retirer</button></div>)}</div></div>
}

function WordleAdmin({ words, wordInput, setWordInput, addWord }) {
  return <div className="admin-view fade-enter"><div className="wordle-admin-grid"><article className="admin-card schedule-card"><p className="eyebrow">Publication automatisee</p><h3>Mot du jour - 00:00</h3><div className="today-word"><span>42</span><strong>PLAY</strong><Pill tone="success">Publie</Pill></div><div className="schedule-line"><span className="line-dot" /><div><b>Demain - 00:00</b><p>Mot selectionne aleatoirement depuis la banque.</p></div></div><div className="schedule-line"><span className="line-dot muted-dot" /><div><b>Apres-demain - 00:00</b><p>Mot en attente de selection automatique.</p></div></div></article><article className="admin-card word-bank"><h3>Banque de mots</h3><p>Ajoute les mots autorises pour les prochains Wordle.</p><div className="add-word"><input value={wordInput} onChange={(event) => setWordInput(event.target.value)} maxLength="8" placeholder="NOUVEAU MOT" /><Button onClick={addWord}>Ajouter</Button></div><div className="word-list">{words.map((word, index) => <span key={word} style={{ '--delay': `${index * 55}ms` }}>{word}</span>)}</div></article></div></div>
}

function EventsAdmin({ rows, setRows, toast }) {
  const [name, setName] = useState('')
  const create = () => {
    const clean = name.trim()
    if (!clean) return
    setRows((items) => [...items, { title: clean, date: 'Date a definir', venue: 'Lieu a definir', status: 'Brouillon', color: 'blue' }])
    setName('')
    toast({ title: 'Evenement cree', copy: `${clean} est ajoute en brouillon.` })
  }

  return <div className="admin-view fade-enter"><div className="toolbar"><div><h3>Evenements publics</h3><p>Le bouton d'inscription peut rediriger vers un formulaire externe.</p></div><div className="inline-create"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nom de l'evenement" /><Button onClick={create}>Ajouter</Button></div></div><div className="event-admin-list">{rows.map((event, index) => <article key={`${event.title}-${index}`} className="admin-card event-admin-row"><div className={`event-thumbnail ${event.color}`}><span>EGC</span></div><div><h3>{event.title}</h3><p>{event.date} - {event.venue}</p></div><Pill tone={event.status === 'A venir' ? 'blue' : 'warning'}>{event.status}</Pill><div className="event-actions"><Button variant="secondary" onClick={() => toast({ title: 'Evenement ouvert', copy: "Les parametres de l'evenement sont prets a etre modifies." })}>Modifier</Button><Button variant="ghost" onClick={() => setRows((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, status: item.status === 'Passe' ? 'A venir' : 'Passe' } : item))}>{event.status === 'Passe' ? 'Remettre a venir' : 'Archiver'}</Button></div></article>)}</div></div>
}

function TournamentsAdmin({ toast }) {
  const [registered, setRegistered] = useState(12)
  const [capacity, setCapacity] = useState(24)
  const normalizedCapacity = Math.max(1, capacity)
  const normalizedRegistered = Math.min(Math.max(0, registered), normalizedCapacity)

  return <div className="admin-view fade-enter"><div className="tournament-admin"><article className="admin-card tournament-control"><p className="eyebrow">Tournoi actif</p><h3>Valorant Duo Bracket</h3><p>Samedi 12 juillet - 18:00</p><div className="capacity"><strong>{normalizedRegistered}</strong><span>/ {normalizedCapacity} inscrits</span></div><div className="progress"><i style={{ width: `${Math.min(100, normalizedRegistered / normalizedCapacity * 100)}%` }} /></div><div className="tournament-form"><label>Places<input type="number" min="1" value={capacity} onChange={(event) => setCapacity(Math.max(1, Number(event.target.value) || 1))} /></label><label>Inscrits<input type="number" min="0" value={registered} onChange={(event) => setRegistered(Math.max(0, Number(event.target.value) || 0))} /></label></div><Button onClick={() => toast({ title: 'Tournoi mis a jour', copy: `Capacite : ${normalizedCapacity} - Inscrits : ${normalizedRegistered}` })}>Enregistrer</Button></article><article className="admin-card participants"><h3>Participants</h3>{['Ayoub Rami', 'Yassine Amrani', 'Sara Benali', 'Omar Lahlou'].map((name, index) => <div className="participant" key={name}><i>{name[0]}</i><b>{name}</b><span>#{String(index + 1).padStart(2, '0')}</span></div>)}</article></div></div>
}

function MinecraftAdmin({ rows, changeRequest }) {
  return <div className="admin-view fade-enter"><div className="toolbar"><div><h3>Demandes d'acces Minecraft</h3><p>Accepte, refuse ou conserve les demandes en attente.</p></div><Pill tone="warning">{rows.filter((row) => row.status === 'En attente').length} A TRAITER</Pill></div><div className="admin-card minecraft-table"><div className="data-head"><span>PSEUDO</span><span>LAUNCHER</span><span>STATUT</span><span>ACTIONS</span></div>{rows.map((row) => <div className="data-row" key={row.name}><b>{row.name}</b><span>{row.launcher}</span><Pill tone={row.status === 'Acceptee' ? 'success' : row.status === 'Refusee' ? 'danger' : 'warning'}>{row.status}</Pill><div className="row-buttons"><Button variant="success" onClick={() => changeRequest(row.name, 'Acceptee')}>Accepter</Button><Button variant="danger" onClick={() => changeRequest(row.name, 'Refusee')}>Refuser</Button></div></div>)}</div></div>
}

function SuccessOverlay({ success, close }) {
  if (!success) return null

  return <div className="success-overlay"><div className="success-card"><span className="confetti c1" /><span className="confetti c2" /><span className="confetti c3" /><span className="confetti c4" /><div className="success-symbol">OK</div><h2>{success.title}</h2><p>{success.copy}</p><div><Button onClick={() => { close(); success.action?.() }}>{success.actionLabel || 'Continuer'}</Button><Button variant="secondary" onClick={close}>Fermer</Button></div></div></div>
}

export default function App() {
  const [page, setPage] = useState('home')
  const [signupOpen, setSignupOpen] = useState(false)
  const [success, setSuccess] = useState(null)
  const [toastState, setToastState] = useState(null)

  const toast = (payload) => {
    setToastState(payload)
    window.clearTimeout(window.__egcToast)
    window.__egcToast = window.setTimeout(() => setToastState(null), 3600)
  }
  const go = (target) => {
    setPage(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const openSignup = () => setSignupOpen(true)

  return (
    <div className="app-shell">
      <nav className="site-nav">
        <button className="brand" onClick={() => go('home')}>EGC <i>G</i></button>
        <div className="site-links">{navItems.map((item) => <button key={item.id} onClick={() => go(item.id)} className={page === item.id ? 'active' : ''} aria-current={page === item.id ? 'page' : undefined}><span>{item.icon}</span>{item.label}</button>)}</div>
        <button className="profile-btn" onClick={() => go('activities')}><i>*</i> Mohamed</button>
      </nav>
      <main className="page-swap" key={page}>
        {page === 'home' && <Home go={go} events={eventsSeed} openSignup={openSignup} />}
        {page === 'events' && <Events events={eventsSeed} openSignup={openSignup} />}
        {page === 'activities' && <Activities go={go} showSuccess={setSuccess} toast={toast} />}
        {page === 'ranking' && <Ranking go={go} />}
        {page === 'admin' && <Admin toast={toast} />}
      </main>
      <Modal open={signupOpen} onClose={() => setSignupOpen(false)}><button className="modal-close" onClick={() => setSignupOpen(false)}>x</button><div className="modal-symbol">-&gt;</div><h2>Continuer vers l'inscription ?</h2><p>Le formulaire d'inscription s'ouvre dans un nouvel onglet. Aucune donnee ne sera enregistree directement par EGC.</p><div className="modal-actions"><Button onClick={() => { setSignupOpen(false); toast({ title: 'Formulaire externe', copy: "Simulation : redirection vers le formulaire d'inscription." }) }}>Ouvrir le formulaire</Button><Button variant="secondary" onClick={() => setSignupOpen(false)}>Retour aux evenements</Button></div></Modal>
      <SuccessOverlay success={success} close={() => setSuccess(null)} />
      <Toast toast={toastState} />
    </div>
  )
}
