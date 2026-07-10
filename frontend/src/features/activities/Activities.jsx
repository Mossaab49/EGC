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
import { buildWordleRows, fallbackEnglishGuessWords } from '../../lib/wordle.js'

function getProgressGuesses(progress) {
  return progress?.attempts?.map((attempt) => attempt.guess) || []
}

function isWordleProgress(value) {
  return typeof value === 'object' && value !== null && Array.isArray(value.attempts)
}

function getProgressMessage(progress, wordLength) {
  const guesses = getProgressGuesses(progress)
  if (progress?.isWon) return 'Bravo, mot trouve !'
  if (progress?.isLost || guesses.length >= 6) return progress?.answer ? `Perdu. Le mot etait ${progress.answer}.` : 'Perdu. Le mot est maintenant revele.'
  if (guesses.length > 0) return `${6 - guesses.length} essais restants.`
  return `Entre un mot de ${wordLength} lettres.`
}

export function Activities({ go, showSuccess }) {
  const {
    cancelRegistration,
    loadEnglishGuessWords,
    loadWordleProgress,
    registerToTournament,
    submitMinecraftParticipationRequest,
    submitWordleGuess,
    tournaments,
    wordBank,
  } = useAppData()
  const { toast } = useToastContext()
  const [tab, setTab] = useState('wordle')
  const [registered, setRegistered] = useState(false)
  const [minecraftSent, setMinecraftSent] = useState(false)
  const [minecraftSubmitting, setMinecraftSubmitting] = useState(false)
  const activeTournament = tournaments.find((tournament) => tournament.status === 'Actif') || tournaments[0]
  const tournamentFallbackImage = makeGameImage('TOURNOI', '#7C3AED', '#11122c')
  const tournamentImage = activeTournament?.imageUrl || tournamentFallbackImage

  useEffect(() => {
    setRegistered(Boolean(activeTournament?.isRegistered))
  }, [activeTournament?.id, activeTournament?.isRegistered])

  return (
    <>
      <PageHeader eyebrow="Espace membre" title="Activites EGC" lead="Joue chaque jour, participe aux tournois et construis ta progression dans la communaute.">
        <div className="tabs">{[['wordle', 'Wordle EGC'], ['tournament', 'Tournoi hebdomadaire'], ['minecraft', 'Serveur Minecraft']].map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`tab ${tab === id ? 'active' : ''}`}>{label}</button>)}</div>
      </PageHeader>
      <section className="section compact"><div className="container">
        {tab === 'wordle' && <WordleGame wordBank={wordBank} showSuccess={showSuccess} go={go} loadEnglishGuessWords={loadEnglishGuessWords} loadWordleProgress={loadWordleProgress} submitWordleGuess={submitWordleGuess} />}
        {tab === 'tournament' && <div className="tournament-layout fade-enter">
          <div className="tournament-banner image-tournament"><img src={tournamentImage} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = tournamentFallbackImage }} /><Pill tone="gold">TOURNOI HEBDOMADAIRE</Pill><Button className="tournament-register-btn" variant={registered ? 'danger' : 'gold'} onClick={async () => { if (registered) { if (activeTournament) await cancelRegistration(activeTournament.id); setRegistered(false); toast({ title: 'Inscription annulee', copy: 'Tu peux te reinscrire avant la fermeture du tournoi.' }); return } if (activeTournament) await registerToTournament(activeTournament.id); setRegistered(true); showSuccess({ title: 'Inscription confirmee', copy: 'Ton dossard #EGC-024 est reserve. Le lien Discord sera envoye avant le tournoi.', action: () => go('ranking'), actionLabel: 'Voir le classement' }) }}>{registered ? "Annuler l'inscription" : "S'inscrire au tournoi"}</Button></div>
          <div className="panel details-panel"><h3>Infos du tournoi</h3><Detail label="Format" text={activeTournament?.format || 'Format a definir'} /><Detail label="Recompense" text={activeTournament?.reward || 'Recompense a definir'} /><Detail label="Date" text={activeTournament?.date || 'Date a definir'} />{registered && <div className="ticket"><strong>OK Inscription confirmee</strong></div>}</div>
        </div>}
        {tab === 'minecraft' && <div className="minecraft-layout fade-enter">
          <div className="minecraft-banner"><Pill tone="gold">OUVERT AUX MEMBRES</Pill><h2>EGC<br />MINECRAFT</h2><p>Survie - Creation - Evenements<br />Un monde construit ensemble.</p><small>Respect - entraide - fair-play</small></div>
          <form className="panel minecraft-form" onSubmit={async (event) => {
            event.preventDefault()
            if (minecraftSubmitting) return
            const data = new FormData(event.currentTarget)
            const name = String(data.get('pseudo-minecraft') || '').trim()
            const launcher = String(data.get('launcher-utilise') || '').trim()
            if (!name || !launcher) {
              toast({ title: 'Infos manquantes', copy: 'Ajoute ton pseudo Minecraft et ton launcher.' })
              return
            }
            setMinecraftSubmitting(true)
            try {
              await submitMinecraftParticipationRequest({ name, launcher })
              setMinecraftSent(true)
              toast({ title: 'Demande envoyee', copy: 'Le responsable Minecraft recevra tes informations.' })
            } catch (error) {
              toast({ title: 'Demande non envoyee', copy: error instanceof Error ? error.message : 'Verifie que le backend est lance.' })
            } finally {
              setMinecraftSubmitting(false)
            }
          }}><h3>Demander une participation</h3><p>Ta demande sera transmise au responsable du serveur.</p><Field required name="pseudo-minecraft" label="Pseudo Minecraft" placeholder="ex. gamer_ensat" /><Field required name="launcher-utilise" label="Launcher utilise" placeholder="ex. TLauncher / officiel" /><label className="check"><input required type="checkbox" /> J'accepte les regles de conduite du serveur.</label><Button type="submit" disabled={minecraftSubmitting} variant={minecraftSent ? 'success' : 'primary'}>{minecraftSubmitting ? 'Envoi...' : minecraftSent ? 'OK Demande envoyee' : 'Envoyer la demande'}</Button></form>
        </div>}
      </div></section>
    </>
  )
}

function WordleGame({ wordBank, showSuccess, go, loadEnglishGuessWords, loadWordleProgress, submitWordleGuess }) {
  const playableWords = useMemo(() => wordBank.filter((word) => word.length >= 3), [wordBank])
  const [englishGuessWords, setEnglishGuessWords] = useState(fallbackEnglishGuessWords)
  const [dictionaryLoaded, setDictionaryLoaded] = useState(false)
  const [progress, setProgress] = useState(null)
  const [isLoadingProgress, setIsLoadingProgress] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentGuess, setCurrentGuess] = useState('')
  const wordLength = progress?.wordLength || 5
  const guesses = useMemo(() => getProgressGuesses(progress), [progress])
  const validGuesses = useMemo(() => new Set([...playableWords, ...englishGuessWords]), [playableWords, englishGuessWords])
  const [message, setMessage] = useState(`Entre un mot de ${wordLength} lettres.`)
  const isWon = Boolean(progress?.isWon)
  const isLost = Boolean(progress?.isLost || (guesses.length >= 6 && !isWon))

  useEffect(() => {
    let cancelled = false

    async function loadProgress() {
      setIsLoadingProgress(true)
      try {
        const nextProgress = await loadWordleProgress()
        if (cancelled) return
        setProgress(nextProgress)
        setCurrentGuess('')
        setMessage(getProgressMessage(nextProgress, nextProgress.wordLength))
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : `Entre un mot de ${wordLength} lettres.`)
        }
      } finally {
        if (!cancelled) setIsLoadingProgress(false)
      }
    }

    loadProgress()
    return () => { cancelled = true }
  }, [loadWordleProgress, wordLength])

  useEffect(() => {
    let cancelled = false

    async function loadDictionary() {
      const words = await loadEnglishGuessWords()
      if (words.length && !cancelled) {
        setEnglishGuessWords(words)
        setDictionaryLoaded(true)
      }
    }

    loadDictionary()
    return () => { cancelled = true }
  }, [loadEnglishGuessWords])

  const submitGuess = async (event) => {
    event.preventDefault()
    const guess = currentGuess.toUpperCase()
    if (isWon || isLost || isSubmitting) return
    if (guess.length !== wordLength) {
      setMessage(`Le mot doit contenir ${wordLength} lettres.`)
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

    setIsSubmitting(true)
    try {
      const result = await submitWordleGuess(guess)
      setCurrentGuess('')

      if (isWordleProgress(result)) {
        setProgress(result)
        setMessage(getProgressMessage(result, result.wordLength || wordLength))
        if (result.isWon && !isWon) {
          const attemptCount = result.attempts.length
          const awardedPoints = result.attempts.find((attempt) => attempt.isCorrect)?.points || 5
          setTimeout(() => showSuccess({ title: 'Mot trouve !', copy: `${result.answer || 'Reponse trouvee'} - ${attemptCount} essais - +${awardedPoints} points`, action: () => go('ranking'), actionLabel: 'Voir le classement' }), 450)
        }
        return
      }

      const fallbackProgress = {
        puzzleKey: 'local',
        attempts: [...(progress?.attempts || []), result],
        isWon: result.isCorrect,
        isLost: (progress?.attempts?.length || 0) + 1 >= 6 && !result.isCorrect,
        remainingAttempts: Math.max(0, 6 - ((progress?.attempts?.length || 0) + 1)),
        wordLength,
        ...(result.isCorrect ? { answer: result.answer } : {}),
      }
      setProgress(fallbackProgress)
      setMessage(getProgressMessage(fallbackProgress, wordLength))
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Impossible de sauvegarder cet essai.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const rows = buildWordleRows({ guesses, currentGuess, wordLength, isWon, isLost })

  return (
    <div className="wordle-layout fade-enter">
      <div className="panel wordle-panel">
        <div className="panel-header"><div><Pill>WORDLE EGC</Pill><h3>Mot de {wordLength} lettres</h3><p>{isLoadingProgress ? 'Chargement de tes essais...' : message}</p></div><span className="timer">{guesses.length}/6 essais</span></div>
        <div className="wordle-board">
          {rows.map((row, rowIndex) => (
            <div className="wordle-row" key={`${rowIndex}-${row}`}>
              {row.split('').map((letter, index) => <Tile key={`${rowIndex}-${index}`} value={letter.trim()} status={progress?.attempts?.[rowIndex]?.statuses?.[index] || ''} />)}
            </div>
          ))}
        </div>
        <form className="wordle-form" onSubmit={submitGuess}>
          <input value={currentGuess} disabled={isWon || isLost || isLoadingProgress || isSubmitting} onChange={(event) => setCurrentGuess(event.target.value.replace(/[^a-zA-Z]/g, '').slice(0, wordLength).toUpperCase())} maxLength={wordLength} placeholder={'_'.repeat(wordLength)} />
          <Button type="submit" disabled={isWon || isLost || isLoadingProgress || isSubmitting}>{isSubmitting ? 'Sauvegarde...' : 'Valider'}</Button>
        </form>
      </div>
      <div className="side-stack">
        <div className="score-panel"><h3>Ta progression</h3><strong>245</strong><p>points au total</p><div className="ranking-mini"><b>#4</b><span>au classement</span></div><div className="score-orb" /></div>
        <div className="panel help-panel"><h3>Comment jouer</h3><Legend tone="correct" text="Bonne lettre, bonne position" /><Legend tone="present" text="Bonne lettre, mauvaise position" /><Legend tone="absent" text="Lettre absente du mot" /><p className="wordle-answer-hint">Les essais valides doivent etre dans la banque EGC ou dans le dictionnaire anglais {dictionaryLoaded ? 'charge depuis words.txt' : 'en cours de chargement'}.</p></div>
      </div>
    </div>
  )
}
