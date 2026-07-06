import React, { useEffect, useMemo, useState } from 'react'
import { Detail } from '../../components/shared/Detail.jsx'
import { Legend } from '../../components/shared/Legend.jsx'
import { PageHeader } from '../../components/shared/PageHeader.jsx'
import { Tile } from '../../components/shared/Tile.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Field } from '../../components/ui/Field.jsx'
import { Pill } from '../../components/ui/Pill.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'
import { useToastContext } from '../../context/ToastContext.jsx'
import { makeGameImage } from '../../lib/game-images.js'
import { buildWordleRows, fallbackEnglishGuessWords, scoreGuess } from '../../lib/wordle.js'
import { loadEnglishDictionary } from '../../services/dictionary-service.js'

export function Activities({ go, showSuccess }) {
  const { tournaments, wordBank } = useAppData()
  const { toast } = useToastContext()
  const [tab, setTab] = useState('wordle')
  const [registered, setRegistered] = useState(false)
  const [minecraftSent, setMinecraftSent] = useState(false)
  const activeTournament = tournaments.find((tournament) => tournament.status === 'Actif') || tournaments[0]
  const tournamentFallbackImage = makeGameImage('TOURNOI', '#7C3AED', '#11122c')
  const tournamentImage = activeTournament?.imageUrl || tournamentFallbackImage

  return (
    <>
      <PageHeader eyebrow="Espace membre" title="Activites EGC" lead="Joue chaque jour, participe aux tournois et construis ta progression dans la communaute.">
        <div className="tabs">{[['wordle', 'Wordle EGC'], ['tournament', 'Tournoi hebdomadaire'], ['minecraft', 'Serveur Minecraft']].map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`tab ${tab === id ? 'active' : ''}`}>{label}</button>)}</div>
      </PageHeader>
      <section className="section compact"><div className="container">
        {tab === 'wordle' && <WordleGame wordBank={wordBank} showSuccess={showSuccess} go={go} />}
        {tab === 'tournament' && <div className="tournament-layout fade-enter">
          <div className="tournament-banner image-tournament"><img src={tournamentImage} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = tournamentFallbackImage }} /><Pill tone="gold">TOURNOI HEBDOMADAIRE</Pill><Button className="tournament-register-btn" variant={registered ? 'danger' : 'gold'} onClick={() => { if (registered) { setRegistered(false); toast({ title: 'Inscription annulee', copy: 'Tu peux te reinscrire avant la fermeture du tournoi.' }); return } setRegistered(true); showSuccess({ title: 'Inscription confirmee', copy: 'Ton dossard #EGC-024 est reserve. Le lien Discord sera envoye avant le tournoi.', action: () => go('ranking'), actionLabel: 'Voir le classement' }) }}>{registered ? "Annuler l'inscription" : "S'inscrire au tournoi"}</Button></div>
          <div className="panel details-panel"><h3>Infos du tournoi</h3><Detail label="Format" text={activeTournament?.format || 'Format a definir'} /><Detail label="Recompense" text={activeTournament?.reward || 'Recompense a definir'} /><Detail label="Date" text={activeTournament?.date || 'Date a definir'} />{registered && <div className="ticket"><strong>OK Inscription confirmee</strong></div>}</div>
        </div>}
        {tab === 'minecraft' && <div className="minecraft-layout fade-enter">
          <div className="minecraft-banner"><Pill tone="gold">OUVERT AUX MEMBRES</Pill><h2>EGC<br />MINECRAFT</h2><p>Survie - Creation - Evenements<br />Un monde construit ensemble.</p><small>Respect - entraide - fair-play</small></div>
          <form className="panel minecraft-form" onSubmit={(event) => { event.preventDefault(); setMinecraftSent(true); toast({ title: 'Demande envoyee', copy: 'Le responsable Minecraft recevra tes informations.' }) }}><h3>Demander une participation</h3><p>Ta demande sera transmise au responsable du serveur.</p><Field required label="Pseudo Minecraft" placeholder="ex. gamer_ensat" /><Field required label="Launcher utilise" placeholder="ex. TLauncher / officiel" /><label className="check"><input required type="checkbox" /> J'accepte les regles de conduite du serveur.</label><Button type="submit" variant={minecraftSent ? 'success' : 'primary'}>{minecraftSent ? 'OK Demande envoyee' : 'Envoyer la demande'}</Button></form>
        </div>}
      </div></section>
    </>
  )
}

function WordleGame({ wordBank, showSuccess, go }) {
  const playableWords = useMemo(() => wordBank.filter((word) => word.length >= 3), [wordBank])
  const [englishGuessWords, setEnglishGuessWords] = useState(fallbackEnglishGuessWords)
  const [dictionaryLoaded, setDictionaryLoaded] = useState(false)
  const validGuesses = useMemo(() => new Set([...playableWords, ...englishGuessWords]), [playableWords, englishGuessWords])
  const [wordIndex, setWordIndex] = useState(0)
  const answer = playableWords[wordIndex % playableWords.length] || 'ARENA'
  const [guesses, setGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [message, setMessage] = useState(`Entre un mot de ${answer.length} lettres.`)
  const isWon = guesses.includes(answer)
  const isLost = guesses.length >= 6 && !isWon

  useEffect(() => {
    setGuesses([])
    setCurrentGuess('')
    setMessage(`Entre un mot de ${answer.length} lettres.`)
  }, [answer])

  useEffect(() => {
    let cancelled = false

    async function loadDictionary() {
      const words = await loadEnglishDictionary()
      if (words.length && !cancelled) {
        setEnglishGuessWords(words)
        setDictionaryLoaded(true)
      }
    }

    loadDictionary()
    return () => { cancelled = true }
  }, [])

  const submitGuess = (event) => {
    event.preventDefault()
    const guess = currentGuess.toUpperCase()
    if (isWon || isLost) return
    if (guess.length !== answer.length) {
      setMessage(`Le mot doit contenir ${answer.length} lettres.`)
      return
    }
    if (!validGuesses.has(guess)) {
      setMessage('Mot non valide. Utilise un mot anglais autorise ou un mot de la liste EGC.')
      return
    }
    if (guesses.includes(guess)) {
      setMessage('Mot deja essaye.')
      return
    }

    const nextGuesses = [...guesses, guess]
    setGuesses(nextGuesses)
    setCurrentGuess('')

    if (guess === answer) {
      setMessage('Bravo, mot trouve !')
      setTimeout(() => showSuccess({ title: 'Mot trouve !', copy: `${answer} - ${nextGuesses.length} essais - +5 points`, action: () => go('ranking'), actionLabel: 'Voir le classement' }), 450)
    } else if (nextGuesses.length >= 6) {
      setMessage(`Perdu. Le mot etait ${answer}.`)
    } else {
      setMessage(`${6 - nextGuesses.length} essais restants.`)
    }
  }

  const resetGame = () => {
    setGuesses([])
    setCurrentGuess('')
    setMessage('Nouveau mot charge.')
    setWordIndex((index) => playableWords.length ? (index + 1) % playableWords.length : 0)
  }

  const rows = buildWordleRows({ guesses, currentGuess, answer, isWon, isLost })

  return (
    <div className="wordle-layout fade-enter">
      <div className="panel wordle-panel">
        <div className="panel-header"><div><Pill>WORDLE EGC</Pill><h3>Mot de {answer.length} lettres</h3><p>{message}</p></div><span className="timer">{guesses.length}/6 essais</span></div>
        <div className="wordle-board">
          {rows.map((row, rowIndex) => (
            <div className="wordle-row" key={`${rowIndex}-${row}`}>
              {row.split('').map((letter, index) => <Tile key={`${rowIndex}-${index}`} value={letter.trim()} status={guesses[rowIndex] ? scoreGuess(row, answer)[index] : ''} />)}
            </div>
          ))}
        </div>
        <form className="wordle-form" onSubmit={submitGuess}>
          <input value={currentGuess} disabled={isWon || isLost} onChange={(event) => setCurrentGuess(event.target.value.replace(/[^a-zA-Z]/g, '').slice(0, answer.length).toUpperCase())} maxLength={answer.length} placeholder={answer.replace(/[A-Z]/g, '_')} />
          <Button type="submit" disabled={isWon || isLost}>Valider</Button>
          <Button type="button" variant="secondary" onClick={resetGame}>Nouveau mot</Button>
        </form>
      </div>
      <div className="side-stack">
        <div className="score-panel"><h3>Ta progression</h3><strong>245</strong><p>points au total</p><div className="ranking-mini"><b>#4</b><span>au classement</span></div><div className="score-orb" /></div>
        <div className="panel help-panel"><h3>Comment jouer</h3><Legend tone="correct" text="Bonne lettre, bonne position" /><Legend tone="present" text="Bonne lettre, mauvaise position" /><Legend tone="absent" text="Lettre absente du mot" /><p className="wordle-answer-hint">Les essais valides doivent etre dans la banque EGC ou dans le dictionnaire anglais {dictionaryLoaded ? 'charge depuis words.txt' : 'en cours de chargement'}.</p></div>
      </div>
    </div>
  )
}
