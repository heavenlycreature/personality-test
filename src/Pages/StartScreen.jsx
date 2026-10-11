import { useEffect, useState, useRef } from 'react'
import { ArrowRight, ArrowLeft } from './Icons'

const inputClass =
  'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2'

const primaryButtonClass =
  'mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 text-base font-semibold text-white transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40'


export default function StartScreen({initialFriendName = '', initialName = '', onStart }) {
  const [step, setStep] = useState(1) // 1 = friend's name, 2 = your name
  const [friendName, setFriendName] = useState(initialFriendName)
  const [name, setName] = useState(initialName)
  const inputRef = useRef(null)

  const friendTrimmed = friendName.trim()
  const nameTrimmed = name.trim()

  useEffect(() => {
    inputRef.current?.focus()
  }, [step])


  const handleSubmit = (e) => {
    e.preventDefault()
    if (step === 1) {
      if (friendTrimmed) setStep(2)
      return
    }
    if (friendTrimmed && nameTrimmed) {
      onStart({ friendName: friendTrimmed, name: nameTrimmed })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-6 pb-8 pt-16">
      {step === 1 ? (
        <>
          <h1 className="text-3xl font-semibold leading-tight text-slate-900">Attachment Test</h1>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-slate-600">
            There are 9 statements about your closest friend. Imagine one person only, then answer
            according to your current feelings. There are no right or wrong answers.
          </p>

          <label htmlFor="friendName" className="mt-10 text-sm font-medium text-slate-900">
            Your closest friend's name (or nickname)
          </label>
          <input
            key="friendName"
            id="friendName"
            ref={inputRef}
            type="text"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            maxLength={60}
            autoComplete="off"
            placeholder="Example: Rina"
            className={inputClass}
          />

          <button type="submit" disabled={!friendTrimmed} className={primaryButtonClass}>
            Next <ArrowRight />
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="-ml-1 flex w-fit items-center gap-1.5 rounded-lg px-1 py-1 text-sm font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600"
          >
            <ArrowLeft /> Back
          </button>

          <h1 className="mt-6 text-3xl font-semibold leading-tight text-slate-900">
            Now, who are you?
          </h1>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-slate-600">
            You'll answer 9 statements about <span className="font-semibold">{friendTrimmed}</span>.
          </p>

          <label htmlFor="name" className="mt-10 text-sm font-medium text-slate-900">
            Your name (or nickname)
          </label>
          <input
            key="name"
            id="name"
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            autoComplete="nickname"
            placeholder="Example: Nabiel"
            className={inputClass}
          />

          <button type="submit" disabled={!nameTrimmed} className={primaryButtonClass}>
            Start <ArrowRight />
          </button>
        </>
      )}
    </form>
  )
}
