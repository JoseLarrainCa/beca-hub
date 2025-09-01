import { createClient } from '@supabase/supabase-js'
import fs from 'fs/promises'

async function loadEnv() {
  try {
    const content = await fs.readFile(new URL('../.env.svc', import.meta.url), 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const l = line.trim()
      if (!l || l.startsWith('#')) continue
      const [k, v] = l.split('=')
      if (!(k in process.env)) process.env[k] = v
    }
  } catch {}
}

await loadEnv()

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_KEY
if (!url || !key) {
  console.error('Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)

// Seed helper
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

const vendors = ['Cafetería Central','Restaurante El Jardín','Comida Rápida UDD','Cafetería UDD']

const { data: wallets, error: werr } = await supabase.from('wallets').select('id,balance')
if (werr) throw werr
if (!wallets?.length) {
  console.log('No hay wallets para generar transacciones')
  process.exit(0)
}

const txns = []
for (let d = 29; d >= 0; d--) {
  const date = new Date()
  date.setDate(date.getDate() - d)
  const perDay = rand(6, 14)
  for (let i = 0; i < perDay; i++) {
    const wallet = wallets[rand(0, wallets.length - 1)]
    const amount = rand(1500, 7000)
    const vendor = vendors[rand(0, vendors.length - 1)]
    const when = new Date(date)
    when.setHours(rand(9, 20), rand(0, 59))
    txns.push({
      id: `seed-${when.getTime()}-${i}`,
      studentId: wallet.id,
      date: when.toISOString(),
      type: 'purchase',
      description: `Compra en ${vendor}`,
      amount: -amount,
      balanceAfter: Math.max(0, (wallet.balance ?? 0) - amount),
      vendor,
    })
  }
}

for (let i = 0; i < txns.length; i += 500) {
  const slice = txns.slice(i, i + 500)
  const { error } = await supabase.from('transactions').upsert(slice, { onConflict: 'id' })
  if (error) throw error
}

console.log(`Creadas/actualizadas ${txns.length} transacciones demo.`)

