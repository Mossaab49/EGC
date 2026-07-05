import React, { useState } from 'react'
import { SuccessOverlay } from './components/shared/SuccessOverlay.jsx'
import { Button } from './components/ui/Button.jsx'
import { Modal } from './components/ui/Modal.jsx'
import { Toast } from './components/ui/Toast.jsx'
import { navItems } from './constants/navigation.js'
import { Account } from './features/account/Account.jsx'
import { Activities } from './features/activities/Activities.jsx'
import { Admin } from './features/admin/Admin.jsx'
import { LoginPage } from './features/auth/LoginPage.jsx'
import { Events } from './features/events/Events.jsx'
import { Home } from './features/home/Home.jsx'
import { Ranking } from './features/ranking/Ranking.jsx'
import { useToast } from './hooks/useToast.js'
import { initialEvents, initialMembers, initialTournaments, initialWords } from './lib/mock-data/index.js'

export default function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('home')
  const [navOpen, setNavOpen] = useState(false)
  const [members, setMembers] = useState(initialMembers)
  const [events, setEvents] = useState(initialEvents)
  const [tournaments, setTournaments] = useState(initialTournaments)
  const [wordBank, setWordBank] = useState(initialWords)
  const [signupEvent, setSignupEvent] = useState(null)
  const [success, setSuccess] = useState(null)
  const { toast, toastState } = useToast()

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
    return <LoginPage members={members} onLogin={(profile) => { setUser(profile); setPage(profile.role === 'Admin' ? 'admin' : 'home') }} />
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
        <button className="profile-btn" onClick={() => go('account')}><i>*</i> {user.name}</button>
      </nav>
      <main className="page-swap" key={page}>
        {page === 'home' && <Home go={go} />}
        {page === 'events' && <Events events={events} openSignup={openSignup} />}
        {page === 'activities' && <Activities go={go} showSuccess={setSuccess} toast={toast} wordBank={wordBank} tournaments={tournaments} />}
        {page === 'account' && <Account user={user} members={members} setMembers={setMembers} toast={toast} />}
        {page === 'ranking' && <Ranking go={go} />}
        {page === 'admin' && <Admin toast={toast} events={events} setEvents={setEvents} tournaments={tournaments} setTournaments={setTournaments} wordBank={wordBank} setWordBank={setWordBank} members={members} setMembers={setMembers} />}
      </main>
      <Modal open={Boolean(signupEvent)} onClose={() => setSignupEvent(null)}><button className="modal-close" onClick={() => setSignupEvent(null)}>x</button><div className="modal-symbol">-&gt;</div><h2>{signupEvent ? `Inscription - ${signupEvent.title}` : 'Inscription'}</h2><p>Le formulaire d'inscription s'ouvre dans un nouvel onglet. Aucune donnee ne sera enregistree directement par EGC.</p><div className="modal-actions"><Button onClick={() => { setSignupEvent(null); toast({ title: 'Formulaire externe', copy: "Simulation : redirection vers le formulaire d'inscription." }) }}>Ouvrir le formulaire</Button><Button variant="secondary" onClick={() => setSignupEvent(null)}>Retour aux evenements</Button></div></Modal>
      <SuccessOverlay success={success} close={() => setSuccess(null)} />
      <Toast toast={toastState} />
    </div>
  )
}
