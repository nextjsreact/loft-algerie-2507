import { requireAuth } from "@/lib/auth"
import { getExecutiveMetrics } from "@/lib/services/executive-dashboard"
import { ExecutiveDashboard } from "@/components/executive/executive-dashboard"
import { redirect } from "next/navigation"
import { getTranslations } from "@/lib/i18n/server"

export default async function ExecutivePage() {
  const session = await requireAuth()
  const t = await getTranslations()
  
  // Vérifier que l'utilisateur a le rôle executive
  if (session.user.role !== 'executive') {
    redirect('/dashboard')
  }

  try {
    const metrics = await getExecutiveMetrics(session.user.id)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                  {t('executive.title')}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {t('executive.subtitle')}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  {t('executive.confidential')}
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {t('executive.executiveOnly')}
                </div>
              </div>
            </div>
          </div>
          
          <ExecutiveDashboard metrics={metrics} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Erreur lors du chargement des métriques executive:', error)
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('executive.accessDenied')}</h1>
          <p className="text-slate-600 mb-4">
            {t('executive.accessDeniedDesc')}
          </p>
          <p className="text-sm text-slate-500">
            {t('executive.executiveLevelRequired')}
          </p>
        </div>
      </div>
    )
  }
}