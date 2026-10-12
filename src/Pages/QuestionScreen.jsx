import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, Check } from './Icons'

export default function QuestionScreen({
  index,
  total,
  question,
  scale,
  value,
  onSelect,
  onBack,
  onNext,
}) {
  const headingRef = useRef(null)
  const isLast = index === total - 1
  const progress = ((index + 1) / total) * 100

  // Pindahkan fokus ke Question baru supaya pembaca layar ikut berpindah.
  useEffect(() => {
    headingRef.current?.focus()
  }, [index])

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 px-5 pb-4 pt-6">
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali"
          className="grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600"
        >
          <ArrowLeft />
        </button>
        <span className="text-lg font-semibold text-slate-900">Attachment Test</span>
      </header>

      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={index + 1}
        aria-label="Kemajuan tes"
        className="h-0.5 w-full bg-violet-200"
      >
        <div
          className="h-full bg-violet-700 transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <fieldset className="flex flex-1 flex-col px-5 pt-6">
        <legend className="sr-only">
          Question {index + 1} from {total}
        </legend>
        <p className="text-sm font-medium text-violet-800" aria-hidden="true">
          Question {index + 1} from {total}
        </p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mt-2 text-[22px] font-semibold leading-snug text-slate-900 focus:outline-none"
        >
          {question.text}
        </h2>

        <div className="mt-6 flex flex-col gap-2.5">
          {scale.map((opt) => {
            const selected = value === opt.value
            return (
              <label key={opt.value} className="block cursor-pointer">
                <input
                  type="radio"
                  name={`q${question.id}`}
                  value={opt.value}
                  checked={selected}
                  onChange={() => onSelect(opt.value)}
                  className="peer sr-only"
                />
                <div
                  className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-violet-600 peer-focus-visible:ring-offset-2 ${
                    selected
                      ? 'border-slate-900 bg-violet-100'
                      : 'border-slate-200 bg-white hover:border-slate-400' 
                  }`}
                >
                  <span className="text-[15px] text-slate-900">
                    {/* <span className="mr-2 font-semibold tabular-nums">{opt.value}</span> */}
                    {opt.label}
                  </span>
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                      selected
                        ? 'border-violet-700 bg-violet-700 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {selected && <Check />}
                  </span>
                </div>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="px-5 pb-8 pt-6">
        <button
          type="button"
          onClick={onNext}
          disabled={value === null}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 text-base font-semibold text-white transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLast ? 'Send answers' : 'Next'} <ArrowRight />
        </button>
      </div>
    </div>
  )
}
