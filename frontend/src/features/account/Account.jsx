import React, { useState } from 'react'
import { PageHeader } from '../../components/shared/PageHeader.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Field } from '../../components/ui/Field.jsx'
import { Pill } from '../../components/ui/Pill.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToastContext } from '../../context/ToastContext.jsx'

export function Account() {
  const { changePassword, user } = useAuth()
  const { toast } = useToastContext()
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const updateForm = (key, value) => { setError(''); setForm((current) => ({ ...current, [key]: value })) }

  const submitPassword = async (event) => {
    event.preventDefault()
    const nextPassword = form.next.trim()
    if (!form.current) {
      setError('Entre ton mot de passe actuel.')
      return
    }
    if (nextPassword.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caracteres.')
      return
    }
    if (nextPassword !== form.confirm.trim()) {
      setError('La confirmation ne correspond pas au nouveau mot de passe.')
      return
    }

    try {
      setIsSubmitting(true)
      await changePassword(form.current, nextPassword)
      setForm({ current: '', next: '', confirm: '' })
      toast({ title: 'Mot de passe modifie', copy: 'Ton nouveau mot de passe est actif.' })
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Impossible de modifier le mot de passe.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader eyebrow="Compte membre" title="Gerer mon compte" lead="Modifie ton mot de passe et garde ton acces EGC a jour." />
      <section className="section compact"><div className="container account-layout"><article className="panel account-card"><div className="account-avatar">{user.name[0]}</div><h3>{user.name}</h3><p>{user.email}</p><Pill tone={user.role === 'Admin' ? 'purple' : 'muted'}>{user.role}</Pill><div className="account-status"><span>Mot de passe</span><strong>{user.mustChangePassword ? 'Changement recommande' : 'A jour'}</strong></div></article><form className="panel account-password-card" onSubmit={submitPassword}><p className="eyebrow">Securite</p><h3>Modifier mon mot de passe</h3><p>Entre ton mot de passe actuel puis choisis le nouveau.</p><Field required label="Mot de passe actuel" type="password" value={form.current} onChange={(event) => updateForm('current', event.target.value)} placeholder="Mot de passe actuel" /><Field required label="Nouveau mot de passe" type="password" value={form.next} onChange={(event) => updateForm('next', event.target.value)} placeholder="Nouveau mot de passe" /><Field required label="Confirmer le mot de passe" type="password" value={form.confirm} onChange={(event) => updateForm('confirm', event.target.value)} placeholder="Confirmer le mot de passe" />{error && <p className="login-error">{error}</p>}<Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Enregistrement...' : 'Enregistrer le mot de passe'}</Button></form></div></section>
    </>
  )
}
