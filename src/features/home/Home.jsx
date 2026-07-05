import { Button } from '../../components/ui/Button.jsx'
import { Pill } from '../../components/ui/Pill.jsx'
import React from 'react';

const clubPoints = [
  ['Competition', 'Tournois campus, challenges rapides et brackets hebdomadaires pour jouer serieusement sans perdre l ambiance club.'],
  ['Communaute', 'Un espace pour rencontrer des joueurs ENSAT, creer des equipes et progresser ensemble.'],
  ['Creation', 'Soirees Minecraft, Wordle EGC, contenus sociaux et formats fun portes par les membres.'],
]

export function Home({ go }) {
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
