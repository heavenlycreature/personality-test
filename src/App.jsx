import { useState } from 'react'
import StartScreen from './Pages/StartScreen'
import QuestionScreen from './Pages/QuestionScreen'
import ResultScreen from './Pages/ResultScreen'
import { QUESTIONS, SCALE } from './lib/questions'
import { scoreAnswers } from './lib/scoring'
import { submitResponse } from './lib/submit'

const emptyAnswers = () => Array(QUESTIONS.length).fill(null)

export default function App() {
  const [stage, setStage] = useState('start') // start | quiz | result
  const [friendName, setFriendName] = useState('') // only used in the start flow, never submitted
  const [name, setName] = useState('')
  const [answers, setAnswers] = useState(emptyAnswers)
  const [index, setIndex] = useState(0)
  const [result, setResult] = useState(null)
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved | failed

  const save = async (n, a) => {
    setSaveStatus('saving')
    try {
      await submitResponse({ name: n, answers: a })
      setSaveStatus('saved')
    } catch (err) {
      console.error(err)
      setSaveStatus('failed')
    }
  }

  const handleStart = ({ friendName: f, name: n }) => {
    setFriendName(f)
    setName(n)
    setIndex(0)
    setStage('quiz')
  }

  const handleSelect = (value) =>
    setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)))

  const handleBack = () => (index === 0 ? setStage('start') : setIndex(index - 1))

  const handleNext = () => {
    if (answers[index] === null) return // every question is required
    if (index < QUESTIONS.length - 1) {
      setIndex(index + 1)
      return
    }
    setResult(scoreAnswers(answers))
    setStage('result')
    save(name, answers)
  }

  const handleRestart = () => {
    setAnswers(emptyAnswers())
    setResult(null)
    setSaveStatus('idle')
    setIndex(0)
    setStage('start')
  }

  return (
    <div className="min-h-[100dvh] bg-[linear-gradient(160deg,#dfe3f6_0%,#f3eeff_45%,#e8f0fb_100%)] font-sans text-slate-900">
      <main className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col">
        {stage === 'start' && (
          <StartScreen
            initialFriendName={friendName}
            initialName={name}
            onStart={handleStart}
          />
        )}
        {stage === 'quiz' && (
          <QuestionScreen
            index={index}
            total={QUESTIONS.length}
            question={QUESTIONS[index]}
            scale={SCALE}
            value={answers[index]}
            onSelect={handleSelect}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}
        {stage === 'result' && result && (
          <ResultScreen
            name={name}
            result={result}
            saveStatus={saveStatus}
            onRetrySave={() => save(name, answers)}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  )
}