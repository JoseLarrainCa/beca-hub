import fs from 'fs/promises'
import { createClient } from '@supabase/supabase-js'

async function loadEnvFallback() {
  // Carga variables desde .env.svc de forma manual si no vienen del flag --env-file
  try {
    const envPath = new URL('../.env.svc', import.meta.url)
    const content = await fs.readFile(envPath, 'utf8')
    const lines = content.split(/\r?\n/)
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      const key = trimmed.slice(0, idx).trim()
      // Soporta comentarios al final de la línea (# ...)
      const rawValue = trimmed.slice(idx + 1).trim()
      const value = rawValue.split('#')[0].trim()
      if (!(key in process.env)) process.env[key] = value
    }
  } catch (_) {
    // Silencioso si no existe
  }
}

await loadEnvFallback()

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const chunk = (arr, size) => {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

async function importTable(tableName, rows) {
  if (!rows || rows.length === 0) {
    console.log(`Skipping ${tableName}: 0 rows`)
    return
  }
  console.log(`Importing ${rows.length} rows into ${tableName}...`)
  for (const batch of chunk(rows, 500)) {
    const { error } = await supabase.from(tableName).upsert(batch, { onConflict: 'id' })
    if (error) throw new Error(`${tableName} upsert failed: ${error.message}`)
  }
  console.log(`Done: ${tableName}`)
}

async function main() {
  const raw = await fs.readFile(new URL('../db.json', import.meta.url), 'utf8')
  const data = JSON.parse(raw)

  // Order matters due to FKs
  await importTable('wallets', data.wallets)
  await importTable('students', data.students)
  await importTable('transactions', data.transactions)
  await importTable('orders', data.orders)
  await importTable('batches', data.batches)

  console.log('All data imported successfully.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


