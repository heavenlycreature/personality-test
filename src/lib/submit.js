const SHEETS_URL = import.meta.env.VITE_SHEETS_URL

// Mengirim nama + 9 jawaban mentah ke Google Apps Script.
// Skor dihitung ulang di sisi script, jadi skor dari browser tidak dipercaya.
// mode 'no-cors' + text/plain menghindari preflight CORS dari Apps Script,
// konsekuensinya balasan server tidak bisa dibaca (hanya error jaringan yang terdeteksi).
export async function submitResponse({ name, answers }) {
  if (!SHEETS_URL) throw new Error('VITE_SHEETS_URL belum diatur di file .env')
  await fetch(SHEETS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ name, answers }),
  })
}
