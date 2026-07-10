import React, { useEffect, useState } from 'react'
import { SuccessOverlay } from './components/shared/SuccessOverlay.jsx'
import { Toast } from './components/ui/Toast.jsx'
import { navItems } from './constants/navigation.js'
import { AppDataProvider } from './context/AppDataContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { ToastProvider, useToastContext } from './context/ToastContext.jsx'
import { Account } from './features/account/Account.jsx'
import { Activities } from './features/activities/Activities.jsx'
import { Admin } from './features/admin/Admin.jsx'
import { LoginPage } from './features/auth/LoginPage.jsx'
import { Events } from './features/events/Events.jsx'
import { Home } from './features/home/Home.jsx'
import { Ranking } from './features/ranking/Ranking.jsx'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppDataProvider>
          <AppContent />
        </AppDataProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

function AppContent() {
  const { user, logout } = useAuth()
  const { toast, toastState } = useToastContext()
  const [page, setPage] = useState(/** @type {import('./types/domain.js').PageId} */ ('home'))
  const [navOpen, setNavOpen] = useState(false)
  const [success, setSuccess] = useState(/** @type {import('./types/domain.js').SuccessMessage | null} */ (null))

  /**
   * @param {import('./types/domain.js').PageId} target
   */
  const go = (target) => {
    if (user?.mustChangePassword && target !== 'account') {
      setPage('account')
      setNavOpen(false)
      toast({ title: 'Changement requis', copy: 'Change ton mot de passe temporaire avant de continuer.' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setPage(target)
    setNavOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (user?.mustChangePassword) {
      setPage('account')
      setNavOpen(false)
    }
  }, [user?.mustChangePassword])

  /**
   * @param {import('./types/domain.js').EventItem} event
   */
  const openSignup = (event) => {
    if (!event?.isSignupOpen) return
    if (!isExternalUrl(event.postUrl)) {
      toast({ title: 'Lien indisponible', copy: "Le formulaire d'inscription n'est pas encore configure par l'admin." })
      return
    }

    window.open(event.postUrl, '_blank', 'noopener,noreferrer')
  }
  const handleLogout = () => {
    logout()
    setPage('home')
    setNavOpen(false)
  }

  /**
   * @param {import('./types/domain.js').AuthUser} profile
   */
  const handleLoggedIn = (profile) => {
    setPage(profile.mustChangePassword ? 'account' : profile.role === 'Admin' ? 'admin' : 'home')
  }

  const visibleNavItems = user?.role === 'Admin' ? navItems : navItems.filter((item) => item.id !== 'admin')

  if (!user) {
    return <LoginPage onLoggedIn={handleLoggedIn} />
  }

  return (
    <div className="app-shell">
      <nav className="site-nav">
        <button className="brand" onClick={() => go('home')} aria-label="Retour a l'accueil"><img src="/assets/logo/DarkLogo.PNG" alt="EGC" /></button>
        <button className={`menu-toggle ${navOpen ? 'active' : ''}`} onClick={() => setNavOpen((value) => !value)} aria-expanded={navOpen} aria-controls="site-links"><span />Menu</button>
        <div id="site-links" className={`site-links ${navOpen ? 'is-open' : ''}`}>
          {visibleNavItems.map((item) => <button key={item.id} onClick={() => go(item.id)} className={page === item.id ? 'active' : ''} aria-current={page === item.id ? 'page' : undefined}><span>{item.icon}</span>{item.label}</button>)}
          <button className="logout-btn menu-logout" onClick={handleLogout}><span>LO</span>Logout</button>
        </div>
        <button className="profile-btn" onClick={() => go('account')}><i>*</i> {user.name}</button>
      </nav>
      <main className="page-swap" key={page}>
        {page === 'home' && <Home go={go} />}
        {page === 'events' && <Events openSignup={openSignup} />}
        {page === 'activities' && <Activities go={go} showSuccess={setSuccess} />}
        {page === 'account' && <Account />}
        {page === 'ranking' && <Ranking go={go} />}
        {page === 'admin' && <Admin />}
      </main>
      <SuccessOverlay success={success} close={() => setSuccess(null)} />
      <Toast toast={toastState} />
    </div>
  )
}

function isExternalUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
