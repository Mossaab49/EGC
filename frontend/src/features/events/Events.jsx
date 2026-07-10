import React, { useState } from 'react'
import { Detail } from '../../components/shared/Detail.jsx'
import { PageHeader } from '../../components/shared/PageHeader.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Pill } from '../../components/ui/Pill.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'
import { makeGameImage } from '../../lib/game-images.js'

function EventCard({ event, onSignup, onDetails, mode = 'upcoming' }) {
  const isPast = mode === 'past' || event.status === 'Passe'
  const canRegister = event.isSignupOpen && isExternalUrl(event.postUrl)

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
          {!isPast && <Button onClick={() => onSignup(event)} disabled={!canRegister} className={!canRegister ? 'is-disabled' : ''}>S'inscrire <span>-&gt;</span></Button>}
          <Button variant="ghost" onClick={() => onDetails(event)}>Infos</Button>
        </div>
      </div>
    </article>
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

export function Events({ openSignup }) {
  const { events } = useAppData()
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
