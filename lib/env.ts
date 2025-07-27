// Configuration des variables d'environnement
export const env = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  AUTH_SECRET: process.env.AUTH_SECRET || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXT_PUBLIC_HAS_DB: process.env.NEXT_PUBLIC_HAS_DB || 'true'
}

// Validation des variables d'environnement critiques (seulement en production)
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'AUTH_SECRET'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`)
  }
}

export default env