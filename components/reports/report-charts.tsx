"use client"

import { useTranslation } from '@/lib/i18n/context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF1919"];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-background border rounded-md shadow-md">
        <p className="font-bold text-foreground">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${Number(entry.value).toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

interface LoftRevenueData {
  name: string;
  revenue: number;
  expenses: number;
  net_profit: number;
}

interface MonthlyRevenueData {
  month: string;
  revenue: number;
  expenses: number;
}

interface ReportChartsProps {
  loftRevenue: LoftRevenueData[];
  monthlyRevenue: MonthlyRevenueData[];
}

export default function ReportCharts({ loftRevenue, monthlyRevenue }: ReportChartsProps) {
  const { t } = useTranslation();
  const top5Lofts = loftRevenue.slice(0, 5);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('analytics.top5ProfitableLofts')}</CardTitle>
            <CardDescription>{t('analytics.mostValuableAssets')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={top5Lofts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="net_profit"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {top5Lofts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('analytics.revenueExpensesByLoft')}</CardTitle>
            <CardDescription>{t('analytics.detailedFinancialPerformance')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={loftRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" name={t('analytics.revenue')} />
                <Bar dataKey="expenses" fill="#8884d8" name={t('analytics.expenses')} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.monthlyFinancialTrend')}</CardTitle>
          <CardDescription>{t('analytics.trackRevenueExpenses')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name={t('analytics.revenue')} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="expenses" stroke="#8884d8" name={t('analytics.expenses')} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
