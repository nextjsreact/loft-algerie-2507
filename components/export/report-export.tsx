"use client"

import { useState } from "react"
import { useTranslation } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, FileText, Table } from "lucide-react"

interface ReportExportProps {
  onExport: (format: string, filters: any) => Promise<void>
}

export function ReportExport({ onExport }: ReportExportProps) {
  const { t } = useTranslation()
  const [format, setFormat] = useState("csv")
  const [dateRange, setDateRange] = useState("month")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await onExport(format, {
        dateRange,
        startDate,
        endDate,
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          {t('reports.exportReports')}
        </CardTitle>
        <CardDescription>{t('reports.downloadReports')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="format">{t('reports.format')}</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    CSV
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateRange">{t('reports.dateRange')}</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">{t('reports.thisWeek')}</SelectItem>
                <SelectItem value="month">{t('reports.thisMonth')}</SelectItem>
                <SelectItem value="quarter">{t('reports.thisQuarter')}</SelectItem>
                <SelectItem value="year">{t('reports.thisYear')}</SelectItem>
                <SelectItem value="custom">{t('reports.customRange')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {dateRange === "custom" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">{t('reports.startDate')}</Label>
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">{t('reports.endDate')}</Label>
              <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        )}

        <Button onClick={handleExport} disabled={isExporting} className="w-full">
          {isExporting ? t('reports.exporting') : `${t('reports.export')} ${format.toUpperCase()}`}
        </Button>
      </CardContent>
    </Card>
  )
}
