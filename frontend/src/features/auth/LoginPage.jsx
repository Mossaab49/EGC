import React, { useState } from 'react'
import { Button } from '../../components/ui/Button.jsx'
import { Field } from '../../components/ui/Field.jsx'
import { Pill } from '../../components/ui/Pill.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export function LoginPage({ onLoggedIn }) {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateForm = (key, value) => { setLoginError(''); setForm((current) => ({ ...current, [key]: value })) }
  const submitLogin = async (event) => {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()

    if (!email || !form.password) {
      setLoginError('Entre ton e-mail et ton mot de passe.')
      return
    }

    if (form.password.length < 8) {
      setLoginError('Le mot de passe doit contenir au moins 8 caracteres.')
      return
    }

    try {
      setIsSubmitting(true)
      const profile = await login(email, form.password)
      onLoggedIn(profile)
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Connexion impossible pour le moment.')
    } finally {
      setIsSubmitting(false)
    }
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
        <p>Connecte-toi avec ton compte EGC.</p>
        <Field required label="Adresse e-mail" value={form.email} onChange={(event) => updateForm('email', event.target.value)} placeholder="membre@egc.ma" />
        <Field required label="Mot de passe" type="password" value={form.password} onChange={(event) => updateForm('password', event.target.value)} placeholder="********" />
        {loginError && <p className="login-error">{loginError}</p>}
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Connexion...' : 'Se connecter'}</Button>
      </form>
    </main>
  )
}
