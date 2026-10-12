import { STYLE_INFO, SCALE_MAX } from '../lib/scoring'

function Meter({ title, hint, score }) {
  const pct = ((score - 1) / (SCALE_MAX - 1)) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-900">{title}</span>
        <span className="text-sm tabular-nums text-slate-900">
          {score.toFixed(2)} <span className="text-slate-500">/ {SCALE_MAX}</span>
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-violet-100">
        <div className="h-full rounded-full bg-violet-700" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
    </div>
  )
}

export default function ResultScreen({ name,friendName, result, saveStatus, onRetrySave, onRestart }) {
  const info = STYLE_INFO[result.style]

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-14">
      <p className="text-sm text-slate-600">Results for {name}'s attachment to {friendName}</p>
      <h1 className="mt-1 text-4xl font-semibold text-slate-900">{result.style}</h1>
      <p className="mt-1 text-sm text-violet-800">{info.traits}</p>
      <p className="mt-5 text-[15px] leading-relaxed text-slate-700">{info.description}</p>

      <div className="mt-8 flex flex-col gap-6 rounded-2xl bg-white/80 p-5">
        <Meter
          title="Avoidance"
          score={result.avoidance}
          hint="How uncomfortable you are being open and dependent on your friend. The lower the score, the more comfortable you are."
        />
        <Meter
          title="Anxiety"
          score={result.anxiety}
          hint="How anxious you are about not being cared for or abandoned. The lower the score, the more confident you are."
        />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        This is the result of a brief test about one friendship, not a diagnosis. The high/low boundaries
        use the midpoint of the scale (4).
      </p>

      <div className="mt-auto pt-8">
        <p className="text-center text-sm text-slate-600" role="status">
          {saveStatus === 'saving' && 'Saving your answers...'}
          {saveStatus === 'saved' && 'Your answers have been submitted.'}
          {saveStatus === 'failed' && (
            <>
              Your answers have not been saved.{' '}
              <button
                type="button"
                onClick={onRetrySave}
                className="font-semibold text-violet-800 underline underline-offset-2"
              >
                Try submitting again
              </button>
            </>
          )}
        </p>
        <button
          type="button"
          onClick={onRestart}
          className="mt-4 w-full rounded-xl border border-slate-900 bg-white py-4 text-base font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
        >
          Retry test
        </button>
      </div>
    </div>
  )
}
