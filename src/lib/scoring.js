// Perhitungan skor ECR-RS (domain pertemanan).
// Jika diubah, ubah juga fungsi score() di apps-script/Code.gs.

export const SCALE_MAX = 7
export const CUTOFF = 4 // titik tengah skala; > 4 = tinggi, <= 4 = rendah

const REVERSED_ITEMS = [1, 2, 3, 4]
const AVOIDANCE_ITEMS = [1, 2, 3, 4, 5, 6]
const ANXIETY_ITEMS = [7, 8, 9]

export const STYLE_INFO = {
  Secure: {
    traits: 'Confident, self-worth, open to support',
    description:
      'You feel comfortable being close and dependent on your friend, and you trust that they care about you.',
  },
  Anxious: {
    traits: 'Easily anxious, emotional, seeks reassurance',
    description:
      'You want to be close and open, but often feel anxious about whether your friend cares about you, so you need a lot of reassurance.',
  },
  Avoidant: {
    traits: 'Maintains distance, not very expressive, avoids intimacy',
    description:
      'You tend to be independent and maintain emotional distance, and you are uncomfortable being dependent or open.',
  },
  Disorganised: {
    traits: 'Intense, inconsistent, unpredictable',
    description:
      'You want to be close but are also afraid; sometimes you get close, sometimes you pull away, because you are anxious and have trouble trusting.',
  },
}

const round2 = (n) => Math.round(n * 100) / 100

/**
 * @param {number[]} answers 9 angka (1-7) berurutan Q1..Q9
 * @returns {{ avoidance: number, anxiety: number, style: string }}
 */
export function scoreAnswers(answers) {
  const valid =
    Array.isArray(answers) &&
    answers.length === 9 &&
    answers.every((a) => Number.isInteger(a) && a >= 1 && a <= SCALE_MAX)
  if (!valid) throw new Error('The answers must be an array of 9 integers between 1 and 7.')

  // Langkah 1: balik item 1-4 (8 - jawaban)
  const adjusted = answers.map((a, i) =>
    REVERSED_ITEMS.includes(i + 1) ? SCALE_MAX + 1 - a : a,
  )
  const sumOf = (items) => items.reduce((total, n) => total + adjusted[n - 1], 0)

  // Langkah 2 & 3: rata-rata per dimensi
  const avoidanceSum = sumOf(AVOIDANCE_ITEMS)
  const anxietySum = sumOf(ANXIETY_ITEMS)

  // Klasifikasi dibandingkan lewat jumlah (bukan rata-rata) supaya bebas error desimal.
  const avoidanceHigh = avoidanceSum > CUTOFF * AVOIDANCE_ITEMS.length
  const anxietyHigh = anxietySum > CUTOFF * ANXIETY_ITEMS.length

  let style
  if (!avoidanceHigh && !anxietyHigh) style = 'Secure'
  else if (!avoidanceHigh && anxietyHigh) style = 'Anxious'
  else if (avoidanceHigh && !anxietyHigh) style = 'Avoidant'
  else style = 'Disorganised'

  return {
    avoidance: round2(avoidanceSum / AVOIDANCE_ITEMS.length),
    anxiety: round2(anxietySum / ANXIETY_ITEMS.length),
    style,
  }
}
