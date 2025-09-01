#!/usr/bin/env node

// Script para crear vendors de ejemplo en Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

if (!supabaseUrl.includes('supabase') || !supabaseKey.startsWith('eyJ')) {
  console.log('⚠️  Configurando vendors de ejemplo en mock data')
  console.log('💡 Para usar Supabase, configura las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')
  process.exit(0)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const vendors = [
  {
    id: 'vendor-cafeteria-andes',
    name: 'Cafetería Andes',
    description: 'Café premium y desayunos nutritivos para toda la comunidad universitaria',
    category: 'Cafetería',
    contactEmail: 'contacto@cafeteriaandes.cl',
    contactPhone: '+56 9 8765 4321',
    address: 'Edificio Principal, Piso 1, Local 101',
    openHours: '07:00 - 19:00',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop',
    status: 'active',
    rating: 4.8
  },
  {
    id: 'vendor-sandwich-u',
    name: 'Sándwich U',
    description: 'Sándwiches gourmet y ensaladas frescas preparados diariamente',
    category: 'Comida Rápida',
    contactEmail: 'admin@sandwichu.cl',
    contactPhone: '+56 9 7654 3210',
    address: 'Edificio de Estudiantes, Piso 2, Local 201',
    openHours: '08:00 - 18:00',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
    status: 'active',
    rating: 4.6
  },
  {
    id: 'vendor-dulce-cafe',
    name: 'Dulce & Café',
    description: 'Postres artesanales y bebidas especiales para endulzar tu día',
    category: 'Postres y Café',
    contactEmail: 'hola@dulceycafe.cl',
    contactPhone: '+56 9 6543 2109',
    address: 'Plaza Central, Local 150',
    openHours: '09:00 - 20:00',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
    status: 'active',
    rating: 4.7
  },
  {
    id: 'vendor-restaurante-jardin',
    name: 'Restaurante El Jardín',
    description: 'Comida casera y menús ejecutivos en un ambiente natural y relajado',
    category: 'Restaurante',
    contactEmail: 'reservas@eljardin.cl',
    contactPhone: '+56 9 5432 1098',
    address: 'Edificio Académico, Terraza',
    openHours: '12:00 - 16:00',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop',
    status: 'active',
    rating: 4.5
  }
]

async function seedVendors() {
  console.log('🌱 Creando vendors de ejemplo...')
  
  try {
    // Verificar conexión
    const { data: test, error: testError } = await supabase
      .from('vendors')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Error conectando a Supabase:', testError.message)
      return
    }

    // Insertar vendors
    const { data, error } = await supabase
      .from('vendors')
      .upsert(vendors, { onConflict: 'id' })
      .select()

    if (error) {
      console.error('❌ Error creando vendors:', error.message)
      return
    }

    console.log(`✅ ${data.length} vendors creados exitosamente:`)
    data.forEach(vendor => {
      console.log(`   📍 ${vendor.name} (${vendor.category})`)
    })

    console.log('\n🎉 ¡Vendors de ejemplo creados! Ahora puedes usar la funcionalidad de agregar local.')
    
  } catch (error) {
    console.error('❌ Error inesperado:', error)
  }
}

seedVendors()


