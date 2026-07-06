import React, { useState } from 'react'
import { PageHeader } from '../../components/shared/PageHeader.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Pill } from '../../components/ui/Pill.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'

export function Ranking({ go }) {
  const { rankings } = useAppData()
  const [period, setPeriod] = useState(/** @type {import('../../types/domain.js').RankingPeriod} */ ('monthly'))
  const rows = rankings[period]

  return (
    <>
      <PageHeader eyebrow="Classement" title={period === 'monthly' ? 'Top joueurs - juillet' : 'Top joueurs - cette semaine'} lead="Les points se gagnent avec le Wordle, les tournois et les series."><div className="filter-row ranking-switch"><button className={`tab ${period === 'monthly' ? 'active' : ''}`} onClick={() => setPeriod('monthly')}>MENSUEL</button><button className={`tab ${period === 'weekly' ? 'active' : ''}`} onClick={() => setPeriod('weekly')}>HEBDOMADAIRE</button></div></PageHeader>
      <section className="section"><div className="container ranking-layout">
        <div className="panel ranking-table fade-enter"><div className="table-head"><span>RANG</span><span>JOUEUR</span><span>POINTS</span></div>{rows.map(([rank, name, initial, points, tone]) => <div key={`${period}-${rank}`} className={`player ${name.includes('Mohamed') ? 'current' : ''}`}><b className={`place ${tone}`}>{rank}</b><span className="player-name"><i className={`avatar ${tone}`}>{initial}</i>{name}</span><strong>{points}</strong></div>)}</div>
        <div className="side-stack"><div className="score-panel ranking-card"><h3>Ton score</h3><strong>{period === 'monthly' ? '245 pts' : '61 pts'}</strong><p>{period === 'monthly' ? '+ 18 pts cette semaine' : '#4 cette semaine'}</p><Button variant="secondary" onClick={() => go('activities')}>Voir mes activites</Button><div className="score-orb" /></div><div className="panel streak-card"><h3>Serie active</h3><b>4 jours</b><p>Encore 1 jour pour gagner le bonus de 5 points.</p><div className="progress"><i /></div><Pill tone="gold">PROCHAIN BONUS +5</Pill></div></div>
      </div></section>
    </>
  )
}
