/**
 * Penerima data kuesioner -> Google Sheets.
 * Header baris 1 di sheet:
 * Name | Q1..Q9 | Avoidance Score | Anxiety Score | Attachment Style
 *
 * Logika score() harus sama dengan src/lib/scoring.js.
 */
const SHEET_NAME = 'Sheet1'
const SCALE_MAX = 7
const CUTOFF = 4
const REVERSED = [1, 2, 3, 4]
const AVOIDANCE = [1, 2, 3, 4, 5, 6]
const ANXIETY = [7, 8, 9]

function doGet() {
  return json_({ ok: true, message: 'Endpoint aktif' })
}

function doPost(e) {
  const lock = LockService.getScriptLock()
  try {
    lock.waitLock(10000)
    const body = JSON.parse(e.postData.contents)
    const name = cleanName_(body.name)
    const answers = body.answers
    const result = score_(answers)

    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0]
    sheet.appendRow([name].concat(answers, [result.avoidance, result.anxiety, result.style]))
    return json_({ ok: true })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  } finally {
    if (lock.hasLock()) lock.releaseLock()
  }
}

function score_(answers) {
  const valid =
    Array.isArray(answers) &&
    answers.length === 9 &&
    answers.every(function (a) {
      return Number.isInteger(a) && a >= 1 && a <= SCALE_MAX
    })
  if (!valid) throw new Error('Jawaban tidak valid')

  const adjusted = answers.map(function (a, i) {
    return REVERSED.indexOf(i + 1) !== -1 ? SCALE_MAX + 1 - a : a
  })
  const sumOf = function (items) {
    return items.reduce(function (t, n) {
      return t + adjusted[n - 1]
    }, 0)
  }
  const avSum = sumOf(AVOIDANCE)
  const anSum = sumOf(ANXIETY)
  const avHigh = avSum > CUTOFF * AVOIDANCE.length
  const anHigh = anSum > CUTOFF * ANXIETY.length

  let style = 'Secure'
  if (!avHigh && anHigh) style = 'Anxious'
  else if (avHigh && !anHigh) style = 'Avoidant'
  else if (avHigh && anHigh) style = 'Disorganised'

  return {
    avoidance: Math.round((avSum / AVOIDANCE.length) * 100) / 100,
    anxiety: Math.round((anSum / ANXIETY.length) * 100) / 100,
    style: style,
  }
}

// Mencegah formula injection di Sheets (nama diawali = + - @)
function cleanName_(raw) {
  let name = String(raw || '').trim().slice(0, 60)
  if (!name) throw new Error('Nama kosong')
  if (/^[=+\-@]/.test(name)) name = "'" + name
  return name
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
