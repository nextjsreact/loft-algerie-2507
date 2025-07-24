#!/usr/bin/env tsx

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env file explicitly
const envPath = resolve(process.cwd(), '.env')
console.log('Loading .env from:', envPath)

const result = config({ path: envPath })
console.log('Dotenv result:', result)

console.log('\nEnvironment variables:')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing')

console.log('\nAll SUPABASE env vars:')
Object.keys(process.env)
  .filter(key => key.includes('SUPABASE'))
  .forEach(key => {
    console.log(`${key}: ${process.env[key] ? 'Set' : 'Missing'}`)
  })

console.log('\nCurrent working directory:', process.cwd())
console.log('Script directory:', __dirname)