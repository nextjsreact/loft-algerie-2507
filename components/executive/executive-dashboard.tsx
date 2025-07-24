"use client"

import { ExecutiveMetrics } from "@/lib/services/executive-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Building, 
  Users, 
  AlertTriangle,
  Shield,
  Target,
  BarChart3,
  PieChart
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts'

interface ExecutiveDashboardProps {
  metrics: ExecutiveMetrics
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function ExecutiveDashboard({ metrics }: ExecutiveDashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const profitabilityData = [
    { name: 'Revenus Entreprise', value: metrics.companyRevenue, color: '#0088FE' },
    { name: 'Revenus Tiers', value: metrics.thirdPartyRevenue, color: '#00C49F' }
  ]

  return (
    <div className="space-y-8">
      {/* Alertes Critiques */}
      {metrics.criticalAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Alertes Critiques
          </h2>
          <div className="grid gap-4">
            {metrics.criticalAlerts.slice(0, 3).map((alert) => (
              <Alert key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  {alert.title}
                  <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </AlertTitle>
                <AlertDescription>
                  {alert.description}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(metrics.totalRevenue)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {metrics.revenueGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {formatPercentage(Math.abs(metrics.revenueGrowth))} vs mois dernier
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Net</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(metrics.netProfit)}
            </div>
            <div className="text-xs text-muted-foreground">
              Marge: {formatPercentage(metrics.profitMargin)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
            <Building className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatPercentage(metrics.occupancyRate)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {metrics.occupancyTrend >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {formatPercentage(Math.abs(metrics.occupancyTrend))} tendance
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(metrics.cashFlow)}
            </div>
            <div className="text-xs text-muted-foreground">
              Flux de trésorerie mensuel
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques Principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendances Mensuelles */}
        <Card>
          <CardHeader>
            <CardTitle>Tendances Financières (12 mois)</CardTitle>
            <CardDescription>
              Évolution des revenus, dépenses et profits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  name="Revenus"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#FF8042" 
                  strokeWidth={2}
                  name="Dépenses"
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition des Revenus */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Revenus</CardTitle>
            <CardDescription>
              Part entreprise vs propriétaires tiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={profitabilityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {profitabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Comparaison Année sur Année */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Année sur Année</CardTitle>
          <CardDescription>
            Comparaison avec l'année précédente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(metrics.yearOverYearComparison.currentYear.revenue)}
              </div>
              <div className="text-sm text-muted-foreground">Revenus {new Date().getFullYear()}</div>
              <div className="flex items-center justify-center mt-2">
                {metrics.yearOverYearComparison.growth.revenue >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={metrics.yearOverYearComparison.growth.revenue >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatPercentage(Math.abs(metrics.yearOverYearComparison.growth.revenue))}
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(metrics.yearOverYearComparison.currentYear.profit)}
              </div>
              <div className="text-sm text-muted-foreground">Profit {new Date().getFullYear()}</div>
              <div className="flex items-center justify-center mt-2">
                {metrics.yearOverYearComparison.growth.profit >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={metrics.yearOverYearComparison.growth.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatPercentage(Math.abs(metrics.yearOverYearComparison.growth.profit))}
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatPercentage(metrics.companyProfitShare)}
              </div>
              <div className="text-sm text-muted-foreground">Part Entreprise</div>
              <div className="text-xs text-muted-foreground mt-2">
                Sur total revenus
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métriques Détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Portefeuille Immobilier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total Lofts:</span>
              <span className="font-semibold">{metrics.totalLofts}</span>
            </div>
            <div className="flex justify-between">
              <span>Prix Moyen:</span>
              <span className="font-semibold">{formatCurrency(metrics.averageRentPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Coûts Maintenance:</span>
              <span className="font-semibold text-red-600">{formatCurrency(metrics.maintenanceCosts)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Croissance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Revenus:</span>
              <div className="flex items-center">
                {metrics.revenueGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatPercentage(metrics.revenueGrowth)}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Dépenses:</span>
              <div className="flex items-center">
                {metrics.expenseGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                )}
                <span className={metrics.expenseGrowth >= 0 ? 'text-red-600' : 'text-green-600'}>
                  {formatPercentage(Math.abs(metrics.expenseGrowth))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statut Système</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Alertes Actives:</span>
              <Badge variant={metrics.criticalAlerts.length > 0 ? "destructive" : "secondary"}>
                {metrics.criticalAlerts.length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Sécurité:</span>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">Sécurisé</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}