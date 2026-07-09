import React, { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../components/shared/PageHeader.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Field } from '../../components/ui/Field.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Pill } from '../../components/ui/Pill.jsx'
import { emptyEventForm, emptyTournamentForm } from '../../constants/forms.js'
import { adminTabs } from '../../constants/navigation.js'
import { useAppData } from '../../context/AppDataContext.jsx'
import { useToastContext } from '../../context/ToastContext.jsx'
import { cssVars } from '../../lib/css-vars.js'
import { readImageFile } from '../../lib/file-reader.js'
import { makeGameImage } from '../../lib/game-images.js'

export function Admin() {
  const {
    addWord,
    createEvent,
    createMember,
    createTournament,
    deleteEvent,
    deleteMember,
    deleteTournament,
    deleteTreatedMinecraftRequests,
    events,
    getTodayWord,
    members,
    minecraftRequests,
    openEventSignup,
    resetMemberPassword,
    removeWord,
    tournaments,
    updateEvent,
    updateMember,
    updateMinecraftRequestStatus,
    updateTournament,
    wordBank,
  } = useAppData()
  const { toast } = useToastContext()
  const [active, setActive] = useState('overview')
  const [collapsed, setCollapsed] = useState(false)
  const [motion, setMotion] = useState('boost')
  const [query, setQuery] = useState('')
  const [newMemberOpen, setNewMemberOpen] = useState(false)
  const [wordInput, setWordInput] = useState('')
  const [todayWord, setTodayWord] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadTodayWord() {
      try {
        const word = await getTodayWord()
        if (!cancelled) setTodayWord(word)
      } catch {
        if (!cancelled) setTodayWord('')
      }
    }

    if (active === 'wordle') loadTodayWord()
    return () => { cancelled = true }
  }, [active, getTodayWord, wordBank.length])
  const filteredMembers = useMemo(() => members.filter((member) => `${member.name} ${member.email}`.toLowerCase().includes(query.toLowerCase())), [members, query])
  const changeRequest = async (id, status) => {
    await updateMinecraftRequestStatus(id, status)
    toast({ title: 'Demande mise a jour', copy: `Statut Minecraft: ${status}.` })
  }
  const clearTreatedMinecraftRequests = async () => {
    const deletedCount = await deleteTreatedMinecraftRequests()
    toast({ title: 'Demandes nettoyees', copy: `${deletedCount} demande(s) traitee(s) supprimee(s).` })
  }
  const removeMember = async (member) => {
    await deleteMember(member.email)
    toast({ title: 'Membre supprime', copy: `${member.name} a ete retire de la liste.` })
  }
  const handleResetMemberPassword = async (email, password) => {
    const cleanPassword = password.trim()
    if (cleanPassword.length < 8) {
      toast({ title: 'Mot de passe trop court', copy: 'Choisis au moins 8 caracteres pour le mot de passe temporaire.' })
      return false
    }
    await resetMemberPassword(email, cleanPassword)
    toast({ title: 'Mot de passe reinitialise', copy: `${email} pourra se connecter avec ce mot de passe temporaire.` })
    return true
  }
  const submitNewMember = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    if (!name || !email) return
    const temporaryPassword = 'EgcTemp12345'
    await createMember({ name, email: email.toLowerCase(), role: 'Membre', points: 0, status: 'Invite', password: temporaryPassword })
    event.currentTarget.reset()
    setNewMemberOpen(false)
    toast({ title: 'Membre cree', copy: `Mot de passe temporaire de ${name}: ${temporaryPassword}` })
  }
  const addWordToBank = async () => {
    const word = wordInput.trim().toUpperCase()
    if (!word || word.length < 3 || wordBank.includes(word)) return
    await addWord(word)
    setWordInput('')
    toast({ title: 'Mot ajoute', copy: `${word} rejoint la banque Wordle.` })
  }

  return (
    <>
      <PageHeader eyebrow="Administration" title="Piloter la communaute EGC" lead="Gere les membres, le Wordle, les evenements, les tournois et les demandes Minecraft." />
      <section className={`section admin-section motion-${motion}`}><div className="container"><div className={`admin-shell ${collapsed ? 'is-collapsed' : ''}`}>
        <aside className="admin-sidebar"><div className="admin-brand"><span>EGC</span><i>G</i><button onClick={() => setCollapsed((value) => !value)} title={collapsed ? 'Afficher le menu' : 'Reduire le menu'}>{collapsed ? '>' : '<'}</button></div><Pill tone="gold">ADMIN</Pill><nav>{adminTabs.map((item) => <button key={item.id} onClick={() => setActive(item.id)} className={active === item.id ? 'active' : ''}><b>{item.icon}</b><span>{item.label}</span></button>)}</nav><div className="sidebar-footer"><span className="pulse-dot" /> Systeme operationnel</div></aside>
        <div className="admin-content"><div className="admin-top"><div><p className="eyebrow">{adminTabs.find((item) => item.id === active)?.label}</p><h2>{active === 'overview' ? 'Tableau de bord' : adminTabs.find((item) => item.id === active)?.label}</h2><p>Juillet 2026 - Donnees de demonstration interactives</p></div><div className="admin-actions"><button className={`motion-control ${motion === 'boost' ? 'active' : ''}`} onClick={() => setMotion(motion === 'boost' ? 'soft' : 'boost')}>{motion === 'boost' ? '* Effets boostes' : 'o Effets doux'}</button><Button onClick={() => setNewMemberOpen(true)}>Creer un membre</Button></div></div>
          {active === 'overview' && <Overview setActive={setActive} events={events} tournaments={tournaments} minecraftRequests={minecraftRequests} />}
          {active === 'members' && <Members rows={filteredMembers} query={query} setQuery={setQuery} onRemove={removeMember} onPasswordReset={handleResetMemberPassword} />}
          {active === 'wordle' && <WordleAdmin words={wordBank} todayWord={todayWord} wordInput={wordInput} setWordInput={setWordInput} addWord={addWordToBank} removeWord={removeWord} />}
          {active === 'events' && <EventsAdmin rows={events} createEvent={createEvent} updateEvent={updateEvent} deleteEvent={deleteEvent} openEventSignup={openEventSignup} toast={toast} />}
          {active === 'tournaments' && <TournamentsAdmin tournaments={tournaments} createTournament={createTournament} updateTournament={updateTournament} deleteTournament={deleteTournament} toast={toast} />}
          {active === 'minecraft' && <MinecraftAdmin rows={minecraftRequests} changeRequest={changeRequest} clearTreated={clearTreatedMinecraftRequests} />}
        </div>
      </div></div></section>
      <Modal open={newMemberOpen} onClose={() => setNewMemberOpen(false)}><button className="modal-close" onClick={() => setNewMemberOpen(false)}>x</button><div className="modal-symbol">+</div><h2>Creer un membre</h2><p>Un mot de passe temporaire sera genere apres la creation du compte.</p><form className="modal-form" onSubmit={submitNewMember}><Field required label="Nom complet" placeholder="Nom du membre" /><Field required label="Adresse e-mail" placeholder="prenom@etu.uae.ac.ma" /><div className="modal-actions"><Button type="submit">Creer le compte</Button><Button type="button" variant="secondary" onClick={() => setNewMemberOpen(false)}>Annuler</Button></div></form></Modal>
    </>
  )
}

function Overview({ setActive, events, tournaments, minecraftRequests }) {
  const upcomingCount = events.filter((event) => event.status !== 'Passe').length
  const activeTournament = tournaments.find((tournament) => tournament.status === 'Actif') || tournaments[0]
  const metrics = [['Membres actifs', '128', '+12 ce mois'], ['Parties Wordle', '874', '68% de reussite'], ['Tournoi en cours', activeTournament?.title || 'Aucun', `${activeTournament?.registered || 0} inscrits`], ['Evenements a venir', String(upcomingCount), events.find((event) => event.isSignupOpen)?.title || 'A ouvrir']]
  const bars = [70, 114, 92, 158, 126, 188, 170]

  return <div className="admin-view fade-enter"><div className="metrics">{metrics.map(([label, value, caption], index) => <article className="metric reveal-card" key={label} style={cssVars({ '--delay': `${index * 70}ms` })}><small>{label}</small><strong>{value}</strong><em>{caption}</em><i className="metric-shine" /></article>)}</div><div className="dash-grid"><article className="admin-card chart-card"><header><h3>Activite des 7 derniers jours</h3><Pill tone="success">+18%</Pill></header><div className="bar-chart">{bars.map((height, index) => <span key={index} style={cssVars({ '--height': `${height}px`, '--delay': `${index * 80}ms` })}><i /><b>{['L', 'M', 'M', 'J', 'V', 'S', 'D'][index]}</b></span>)}</div></article><article className="admin-card quick-card"><h3>Actions rapides</h3><Button variant="ghost" onClick={() => setActive('members')}>MB Gerer les membres</Button><Button variant="ghost" onClick={() => setActive('wordle')}>WD Ajouter un mot Wordle</Button><Button variant="ghost" onClick={() => setActive('events')}>EV Creer un evenement</Button><Button onClick={() => setActive('tournaments')}>TR Nouveau tournoi</Button></article></div><article className="admin-card mini-requests"><header><h3>Dernieres demandes Minecraft</h3><Button variant="secondary" onClick={() => setActive('minecraft')}>Voir tout</Button></header>{minecraftRequests.slice(0, 3).map((request) => <div className="request-row" key={request.id || request.name}><b>{request.name}</b><span>{request.launcher}</span><Pill tone={request.status === 'Acceptee' ? 'success' : request.status === 'Refusee' ? 'danger' : 'warning'}>{request.status}</Pill></div>)}{minecraftRequests.length === 0 && <div className="request-row"><b>Aucune demande</b><span>-</span><Pill tone="muted">VIDE</Pill></div>}</article></div>
}

function Members({ rows, query, setQuery, onRemove, onPasswordReset }) {
  const [passwordTarget, setPasswordTarget] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const selectedMember = rows.find((member) => member.email === passwordTarget)

  const submitPasswordReset = async (event) => {
    event.preventDefault()
    if (await onPasswordReset(passwordTarget, newPassword)) {
      setPasswordTarget('')
      setNewPassword('')
    }
  }

  const openPasswordReset = (email) => {
    setPasswordTarget(email)
    setNewPassword('')
  }

  return <div className="admin-view fade-enter"><div className="toolbar"><div><h3>Membres de la communaute</h3><p>Creation, gestion des roles et suivi des points.</p></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un membre..." /></div>{selectedMember && <form className="admin-card password-reset-card" onSubmit={submitPasswordReset}><div><p className="eyebrow">Reset acces</p><h3>Changer le mot de passe</h3><p>{selectedMember.name} pourra se connecter avec ce mot de passe temporaire.</p></div><label className="field"><span>Nouveau mot de passe</span><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Mot de passe temporaire" autoFocus /></label><div className="form-actions"><Button type="submit">Enregistrer</Button><Button type="button" variant="secondary" onClick={() => { setPasswordTarget(''); setNewPassword('') }}>Annuler</Button></div></form>}<div className="admin-card data-table members-table"><div className="data-head"><span>MEMBRE</span><span>ROLE</span><span>POINTS</span><span>STATUT</span><span>ACTIONS</span></div>{rows.map((member) => <div className="data-row" key={member.email}><span className="member-cell"><i>{member.name[0]}</i><b>{member.name}<small>{member.email}</small></b></span><Pill tone={member.role === 'Admin' ? 'purple' : 'muted'}>{member.role}</Pill><strong>{member.points}</strong><Pill tone={member.status === 'Actif' ? 'success' : 'warning'}>{member.status}</Pill><span className="row-buttons"><button className="row-action" onClick={() => openPasswordReset(member.email)}>Changer MDP</button><button className="row-action danger" onClick={() => onRemove(member)}>Retirer</button></span></div>)}</div></div>
}

function WordleAdmin({ words, todayWord, wordInput, setWordInput, addWord, removeWord }) {
  return <div className="admin-view fade-enter"><div className="wordle-admin-grid"><article className="admin-card schedule-card"><p className="eyebrow">Publication backend</p><h3>Mot du jour Wordle</h3><div className="today-word"><span>{words.length}</span><strong>{todayWord || '...'}</strong><Pill tone="success">Backend</Pill></div><div className="schedule-line"><span className="line-dot" /><div><b>Lie au backend</b><p>Ce mot est calcule par l API Wordle avec la banque sauvegardee en base. Les essais des joueurs sont aussi sauvegardes cote backend.</p></div></div></article><article className="admin-card word-bank"><h3>Banque de mots</h3><p>Ajoute des mots gaming de 3 lettres ou plus.</p><div className="add-word"><input value={wordInput} onChange={(event) => setWordInput(event.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 12).toUpperCase())} maxLength={12} placeholder="VALORANT" /><Button onClick={addWord}>Ajouter</Button></div><div className="word-list">{words.map((word, index) => <span key={word} style={cssVars({ '--delay': `${index * 55}ms` })}>{word}<button disabled={words.length <= 1} onClick={() => removeWord(word)}>x</button></span>)}</div></article></div></div>
}
function EventsAdmin({ rows, createEvent, updateEvent, deleteEvent, openEventSignup, toast }) {
  const [form, setForm] = useState(emptyEventForm)
  const [editingId, setEditingId] = useState(null)

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const resetForm = () => {
    setForm(emptyEventForm)
    setEditingId(null)
  }
  const saveEvent = async (event) => {
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
    try {
      if (editingId) {
        await updateEvent(editingId, payload)
      } else {
        await createEvent(payload)
      }
    } catch (error) {
      toast({ title: 'Image non enregistree', copy: error instanceof Error ? error.message : 'Impossible d enregistrer cet evenement.' })
      return
    }
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
  const openSignup = async (id) => {
    await openEventSignup(id)
  }

  return <div className="admin-view fade-enter"><form className="admin-card admin-form-grid" onSubmit={saveEvent}><div><h3>{editingId ? 'Modifier evenement' : 'Ajouter evenement'}</h3><p>Les changements apparaissent directement dans la page Evenements.</p></div><Field required label="Titre" value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="Nom de l evenement" /><Field label="Date" value={form.date} onChange={(event) => updateForm('date', event.target.value)} placeholder="20 juillet - 14:00" /><Field label="Lieu" value={form.venue} onChange={(event) => updateForm('venue', event.target.value)} placeholder="ENSAT Arena" /><label className="field"><span>Statut</span><select value={form.status} onChange={(event) => updateForm('status', event.target.value)}><option>A venir</option><option>Passe</option><option>Brouillon</option></select></label><Field label="Categorie" value={form.category} onChange={(event) => updateForm('category', event.target.value)} placeholder="FPS, Sport gaming..." /><Field label="Image URL" value={form.imageUrl} onChange={(event) => updateForm('imageUrl', event.target.value)} placeholder="https://..." /><label className="field"><span>Choisir image</span><input type="file" accept="image/*" onChange={(event) => readImageFile(event, (imageUrl) => updateForm('imageUrl', imageUrl))} /></label><Field label="Post URL" value={form.postUrl} onChange={(event) => updateForm('postUrl', event.target.value)} placeholder="Lien du post" />{form.imageUrl && <div className="image-preview wide"><img src={form.imageUrl} alt="" /></div>}<label className="field wide"><span>Infos</span><textarea value={form.details} onChange={(event) => updateForm('details', event.target.value)} placeholder="Details affiches au clic sur Infos" /></label><label className="field wide"><span>Regles</span><textarea value={form.rules} onChange={(event) => updateForm('rules', event.target.value)} placeholder="Conditions, format, materiel..." /></label><div className="form-actions wide"><Button type="submit">{editingId ? 'Enregistrer' : 'Ajouter'}</Button><Button type="button" variant="secondary" onClick={resetForm}>Annuler</Button></div></form><div className="event-admin-list">{rows.map((event) => <article key={event.id} className="admin-card event-admin-row"><div className="event-thumbnail image-thumb"><img src={event.imageUrl || makeGameImage('EGC', '#1E50B4', '#0D0D1A')} alt="" /></div><div><h3>{event.title}</h3><p>{event.date} - {event.venue}</p></div><Pill tone={event.status === 'A venir' ? 'blue' : event.status === 'Passe' ? 'muted' : 'warning'}>{event.status}</Pill><div className="event-actions"><Button variant="secondary" onClick={() => editEvent(event)}>Modifier</Button><Button variant={event.isSignupOpen ? 'success' : 'ghost'} onClick={() => openSignup(event.id)} disabled={event.status === 'Passe'}>{event.isSignupOpen ? 'Inscription active' : 'Activer inscription'}</Button><Button variant="danger" onClick={() => deleteEvent(event.id)}>Supprimer</Button></div></article>)}</div></div>
}

function TournamentsAdmin({ tournaments, createTournament, updateTournament, deleteTournament, toast }) {
  const [form, setForm] = useState(emptyTournamentForm)
  const [editingId, setEditingId] = useState(null)

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const resetForm = () => {
    setForm(emptyTournamentForm)
    setEditingId(null)
  }
  const saveTournament = async (event) => {
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
    if (editingId) {
      await updateTournament(editingId, payload)
    } else {
      await createTournament(payload)
    }
    toast({ title: editingId ? 'Tournoi modifie' : 'Tournoi ajoute', copy: `${payload.title} est enregistre.` })
    resetForm()
  }
  const editTournament = (tournament) => {
    setEditingId(tournament.id)
    setForm(tournament)
  }

  return <div className="admin-view fade-enter"><div className="tournament-admin"><form className="admin-card tournament-control" onSubmit={saveTournament}><p className="eyebrow">{editingId ? 'Edition tournoi' : 'Nouveau tournoi'}</p><Field required label="Titre" value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="Valorant Duo Bracket" /><Field label="Jeu" value={form.game} onChange={(event) => updateForm('game', event.target.value)} placeholder="Valorant" /><Field label="Date" value={form.date} onChange={(event) => updateForm('date', event.target.value)} placeholder="Samedi - 18:00" /><div className="tournament-form"><label>Places<input type="number" min="1" value={form.capacity} onChange={(event) => updateForm('capacity', Number(event.target.value) || 1)} /></label><label>Inscrits<input type="number" min="0" value={form.registered} onChange={(event) => updateForm('registered', Number(event.target.value) || 0)} /></label></div><Field label="Format" value={form.format} onChange={(event) => updateForm('format', event.target.value)} placeholder="Duo - Elimination directe" /><Field label="Recompense" value={form.reward} onChange={(event) => updateForm('reward', event.target.value)} placeholder="60 pts" /><Field label="Image URL" value={form.imageUrl || ''} onChange={(event) => updateForm('imageUrl', event.target.value)} placeholder="https://..." /><label className="field"><span>Choisir image</span><input type="file" accept="image/*" onChange={(event) => readImageFile(event, (imageUrl) => updateForm('imageUrl', imageUrl))} /></label>{form.imageUrl && <div className="image-preview"><img src={form.imageUrl} alt="" /></div>}<label className="field"><span>Statut</span><select value={form.status} onChange={(event) => updateForm('status', event.target.value)}><option>Brouillon</option><option>Actif</option><option>Termine</option></select></label><div className="form-actions"><Button type="submit">{editingId ? 'Enregistrer' : 'Ajouter tournoi'}</Button><Button type="button" variant="secondary" onClick={resetForm}>Annuler</Button></div></form><article className="admin-card participants"><h3>Tournois</h3>{tournaments.map((tournament) => <div className="tournament-row" key={tournament.id}><img src={tournament.imageUrl || makeGameImage('TOURNOI', '#7C3AED', '#11122c')} alt="" /><div><b>{tournament.title}</b><span>{tournament.game} - {tournament.date}</span><small>{tournament.registered}/{tournament.capacity} inscrits - {tournament.status}</small></div><div className="row-buttons"><Button variant="secondary" onClick={() => editTournament(tournament)}>Modifier</Button><Button variant="danger" onClick={() => deleteTournament(tournament.id)}>Supprimer</Button></div></div>)}</article></div></div>
}

function MinecraftAdmin({ rows, changeRequest, clearTreated }) {
  const treatedCount = rows.filter((row) => row.status !== 'En attente').length
  return <div className="admin-view fade-enter"><div className="toolbar"><div><h3>Demandes d'acces Minecraft</h3><p>Accepte, refuse ou conserve les demandes en attente.</p></div><div className="row-buttons"><Pill tone="warning">{rows.filter((row) => row.status === 'En attente').length} A TRAITER</Pill><Button variant="danger" onClick={clearTreated} disabled={treatedCount === 0}>Supprimer traitees</Button></div></div><div className="admin-card minecraft-table"><div className="data-head"><span>PSEUDO</span><span>LAUNCHER</span><span>STATUT</span><span>ACTIONS</span></div>{rows.map((row) => <div className="data-row" key={row.id || row.name}><b>{row.name}</b><span>{row.launcher}</span><Pill tone={row.status === 'Acceptee' ? 'success' : row.status === 'Refusee' ? 'danger' : 'warning'}>{row.status}</Pill><div className="row-buttons"><Button variant="success" onClick={() => changeRequest(row.id, 'Acceptee')} disabled={!row.id || row.status === 'Acceptee'}>Accepter</Button><Button variant="danger" onClick={() => changeRequest(row.id, 'Refusee')} disabled={!row.id || row.status === 'Refusee'}>Refuser</Button></div></div>)}{rows.length === 0 && <div className="data-row"><b>Aucune demande</b><span>-</span><Pill tone="muted">VIDE</Pill><span>-</span></div>}</div></div>
}


