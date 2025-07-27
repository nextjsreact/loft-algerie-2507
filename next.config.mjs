/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['pg'],

  // Configuration pour les variables d'environnement
  env: {
    NEXT_PUBLIC_HAS_DB: 'true'
  },
  // Configuration pour Vercel
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  }
}

// Log pour le développement seulement
if (process.env.NODE_ENV === 'development') {
  console.log('Development mode - Next.js configuration loaded')
}

export default nextConfig
