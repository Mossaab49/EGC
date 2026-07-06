import React, { useState } from 'react'
import { Button } from '../../components/ui/Button.jsx'
import { Field } from '../../components/ui/Field.jsx'
import { Pill } from '../../components/ui/Pill.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export function LoginPage({ onLoggedIn }) {
  const { isLoading, members } = useAppData()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loginError, setLoginError] = useState('')

  const updateForm = (key, value) => { setLoginError(''); setForm((current) => ({ ...current, [key]: value })) }
  const submitLogin = (event) => {
    event.preventDefault()
    if (isLoading) {
      setLoginError('Chargement des donnees du prototype...')
      return
    }
    const email = form.email.trim().toLowerCase()
    const knownMember = members.find((member) => member.email.toLowerCase() === email)
    if (knownMember?.password && knownMember.password !== form.password) {
      setLoginError('Mot de passe incorrect. Contacte un admin pour le reinitialiser.')
      return
    }
    const cleanName = form.name.trim() || knownMember?.name || email.split('@')[0] || 'Membre EGC'
    const profile = { name: cleanName, email, role: knownMember?.role || 'Membre' }
    login(profile)
    onLoggedIn(profile)
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
        {loginError && <p className="login-error">{loginError}</p>}
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Chargement...' : 'Se connecter'}</Button>
      </form>
    </main>
  )
}
