import React, { useState } from 'react'
import { PageHeader } from '../../components/shared/PageHeader.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Field } from '../../components/ui/Field.jsx'
import { Pill } from '../../components/ui/Pill.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToastContext } from '../../context/ToastContext.jsx'

export function Account() {
  const { user } = useAuth()
  const { createMember, members, updateMember } = useAppData()
  const { toast } = useToastContext()
  const member = members.find((item) => item.email.toLowerCase() === user.email.toLowerCase())
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [error, setError] = useState('')
  const hasPassword = Boolean(member?.password)
  const updateForm = (key, value) => { setError(''); setForm((current) => ({ ...current, [key]: value })) }

  const submitPassword = async (event) => {
    event.preventDefault()
    const nextPassword = form.next.trim()
    if (hasPassword && form.current !== member.password) {
      setError('Le mot de passe actuel est incorrect.')
      return
    }
    if (nextPassword.length < 4) {
      setError('Le nouveau mot de passe doit contenir au moins 4 caracteres.')
      return
    }
    if (nextPassword !== form.confirm.trim()) {
      setError('La confirmation ne correspond pas au nouveau mot de passe.')
      return
    }

    const updatedMember = {
      name: member?.name || user.name,
      email: user.email.toLowerCase(),
      role: member?.role || user.role || 'Membre',
      points: member?.points || 0,
      status: member?.status || 'Actif',
      password: nextPassword,
      passwordUpdatedAt: new Date().toLocaleDateString('fr-FR'),
    }
    if (members.some((item) => item.email.toLowerCase() === user.email.toLowerCase())) {
      await updateMember(user.email, updatedMember)
    } else {
      await createMember(updatedMember)
    }
    setForm({ current: '', next: '', confirm: '' })
    toast({ title: 'Mot de passe modifie', copy: 'Ton nouveau mot de passe est actif pour cette session locale.' })
  }

  return (
    <>
      <PageHeader eyebrow="Compte membre" title="Gerer mon compte" lead="Modifie ton mot de passe et garde ton acces EGC a jour." />
      <section className="section compact"><div className="container account-layout"><article className="panel account-card"><div className="account-avatar">{user.name[0]}</div><h3>{user.name}</h3><p>{user.email}</p><Pill tone={user.role === 'Admin' ? 'purple' : 'muted'}>{user.role}</Pill><div className="account-status"><span>Mot de passe</span><strong>{hasPassword ? `Modifie le ${member.passwordUpdatedAt || 'recemment'}` : 'Non defini localement'}</strong></div></article><form className="panel account-password-card" onSubmit={submitPassword}><p className="eyebrow">Securite</p><h3>Modifier mon mot de passe</h3><p>{hasPassword ? 'Entre ton mot de passe actuel puis choisis le nouveau.' : 'Choisis ton premier mot de passe pour ce prototype local.'}</p>{hasPassword && <Field required label="Mot de passe actuel" type="password" value={form.current} onChange={(event) => updateForm('current', event.target.value)} placeholder="Mot de passe actuel" />}<Field required label="Nouveau mot de passe" type="password" value={form.next} onChange={(event) => updateForm('next', event.target.value)} placeholder="Nouveau mot de passe" /><Field required label="Confirmer le mot de passe" type="password" value={form.confirm} onChange={(event) => updateForm('confirm', event.target.value)} placeholder="Confirmer le mot de passe" />{error && <p className="login-error">{error}</p>}<Button type="submit">Enregistrer le mot de passe</Button></form></div></section>
    </>
  )
}
