"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loftSchema, type LoftFormData } from "@/lib/validations"
import type { Loft, LoftOwner } from "@/lib/types"
import { ZoneArea, getZoneAreas } from "@/app/actions/zone-areas" // Import ZoneArea and getZoneAreas
import { InternetConnectionType } from "@/lib/types" // Import InternetConnectionType

interface LoftFormProps {
  loft?: Loft
  owners: LoftOwner[]
  zoneAreas: ZoneArea[]
  internetConnectionTypes: InternetConnectionType[] // Add internetConnectionTypes prop
  onSubmit: (data: LoftFormData) => Promise<void>
  isSubmitting?: boolean
}

export function LoftForm({ loft, owners = [], zoneAreas = [], internetConnectionTypes = [], onSubmit, isSubmitting = false }: LoftFormProps) {
  console.log('LoftForm props:', { owners, loft }) // Debug props
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoftFormData>({
    resolver: zodResolver(loftSchema),
    defaultValues: loft
      ? {
          name: loft.name,
          description: loft.description || "",
          address: loft.address,
          price_per_month: loft.price_per_month,
          status: loft.status,
          owner_id: loft.owner_id,
          company_percentage: loft.company_percentage,
          owner_percentage: loft.owner_percentage,
          zone_area_id: loft.zone_area_id || "",
          internet_connection_type_id: loft.internet_connection_type_id || "",
          water_customer_code: loft.water_customer_code || "",
          water_contract_code: loft.water_contract_code || "",
          water_meter_number: loft.water_meter_number || "",
          water_correspondent: loft.water_correspondent || "",
          electricity_pdl_ref: loft.electricity_pdl_ref || "",
          electricity_customer_number: loft.electricity_customer_number || "",
          electricity_meter_number: loft.electricity_meter_number || "",
          electricity_correspondent: loft.electricity_correspondent || "",
          gas_pdl_ref: loft.gas_pdl_ref || "",
          gas_customer_number: loft.gas_customer_number || "",
          gas_meter_number: loft.gas_meter_number || "",
          gas_correspondent: loft.gas_correspondent || "",
          phone_number: loft.phone_number || "",
        }
      : {
          status: "available",
          company_percentage: 50,
          owner_percentage: 50,
          zone_area_id: "",
          internet_connection_type_id: "",
          water_customer_code: "",
          water_contract_code: "",
          water_meter_number: "",
          water_correspondent: "",
          electricity_pdl_ref: "",
          electricity_customer_number: "",
          electricity_meter_number: "",
          electricity_correspondent: "",
          gas_pdl_ref: "",
          gas_customer_number: "",
          gas_meter_number: "",
          gas_correspondent: "",
          phone_number: "",
        },
  })

  const companyPercentage = watch("company_percentage")

  const handleFormSubmit = async (data: LoftFormData) => {
    setIsLoading(true)
    setError("")

    try {
      await onSubmit(data)
      // No automatic navigation - let parent component handle success
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{loft ? "Edit Loft" : "Add New Loft"}</CardTitle>
        <CardDescription>{loft ? "Update loft information" : "Create a new loft property"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select key={loft?.status} onValueChange={(value) => setValue("status", value as any)} defaultValue={loft?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
            {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zone_area_id">Zone Area</Label>
            <Select key={loft?.zone_area_id} onValueChange={(value) => setValue("zone_area_id", value)} defaultValue={loft?.zone_area_id || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select zone area" />
              </SelectTrigger>
              <SelectContent>
                {zoneAreas.map((zoneArea) => (
                  <SelectItem key={zoneArea.id} value={zoneArea.id}>
                    {zoneArea.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.zone_area_id && <p className="text-sm text-red-500">{errors.zone_area_id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="internet_connection_type_id">Internet Connection Type</Label>
            <Select key={loft?.internet_connection_type_id} onValueChange={(value) => setValue("internet_connection_type_id", value)} defaultValue={loft?.internet_connection_type_id || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select internet connection type" />
              </SelectTrigger>
              <SelectContent>
                {internetConnectionTypes.map((ict) => (
                  <SelectItem key={ict.id} value={ict.id}>
                    {ict.type} ({ict.speed}) - {ict.provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.internet_connection_type_id && <p className="text-sm text-red-500">{errors.internet_connection_type_id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_per_month">Monthly Rent ($)</Label>
              <Input
                id="price_per_month"
                type="number"
                step="0.01"
                {...register("price_per_month", { valueAsNumber: true })}
              />
              {errors.price_per_month && <p className="text-sm text-red-500">{errors.price_per_month.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner_id">Owner</Label>
              <Select key={loft?.owner_id} onValueChange={(value) => setValue("owner_id", value)} defaultValue={loft?.owner_id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((owner) => (
                    <SelectItem key={owner.id} value={owner.id}>
                      {owner.name} ({owner.ownership_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.owner_id && <p className="text-sm text-red-500">{errors.owner_id.message}</p>}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold">Water Bill Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="water_customer_code">Customer Code</Label>
                <Input id="water_customer_code" {...register("water_customer_code")} />
                {errors.water_customer_code && <p className="text-sm text-red-500">{errors.water_customer_code.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="water_contract_code">Contract Code</Label>
                <Input id="water_contract_code" {...register("water_contract_code")} />
                {errors.water_contract_code && <p className="text-sm text-red-500">{errors.water_contract_code.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="water_meter_number">Meter Number</Label>
                <Input id="water_meter_number" {...register("water_meter_number")} />
                {errors.water_meter_number && <p className="text-sm text-red-500">{errors.water_meter_number.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="water_correspondent">Correspondent</Label>
                <Input id="water_correspondent" {...register("water_correspondent")} />
                {errors.water_correspondent && <p className="text-sm text-red-500">{errors.water_correspondent.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold">Electricity Bill Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="electricity_pdl_ref">Ref PDL</Label>
                <Input id="electricity_pdl_ref" {...register("electricity_pdl_ref")} />
                {errors.electricity_pdl_ref && <p className="text-sm text-red-500">{errors.electricity_pdl_ref.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="electricity_customer_number">Customer Number</Label>
                <Input id="electricity_customer_number" {...register("electricity_customer_number")} />
                {errors.electricity_customer_number && <p className="text-sm text-red-500">{errors.electricity_customer_number.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="electricity_meter_number">Meter Number</Label>
                <Input id="electricity_meter_number" {...register("electricity_meter_number")} />
                {errors.electricity_meter_number && <p className="text-sm text-red-500">{errors.electricity_meter_number.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="electricity_correspondent">Correspondent</Label>
                <Input id="electricity_correspondent" {...register("electricity_correspondent")} />
                {errors.electricity_correspondent && <p className="text-sm text-red-500">{errors.electricity_correspondent.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold">Gas Bill Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gas_pdl_ref">Ref PDL</Label>
                <Input id="gas_pdl_ref" {...register("gas_pdl_ref")} />
                {errors.gas_pdl_ref && <p className="text-sm text-red-500">{errors.gas_pdl_ref.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gas_customer_number">Customer Number</Label>
                <Input id="gas_customer_number" {...register("gas_customer_number")} />
                {errors.gas_customer_number && <p className="text-sm text-red-500">{errors.gas_customer_number.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gas_meter_number">Meter Number</Label>
                <Input id="gas_meter_number" {...register("gas_meter_number")} />
                {errors.gas_meter_number && <p className="text-sm text-red-500">{errors.gas_meter_number.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gas_correspondent">Correspondent</Label>
                <Input id="gas_correspondent" {...register("gas_correspondent")} />
                {errors.gas_correspondent && <p className="text-sm text-red-500">{errors.gas_correspondent.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input id="phone_number" {...register("phone_number")} />
            {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_percentage">Company Share (%)</Label>
              <Input
                id="company_percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...register("company_percentage", {
                  valueAsNumber: true,
                  onChange: (e) => {
                    const value = Number.parseFloat(e.target.value) || 0
                    setValue("owner_percentage", 100 - value)
                  },
                })}
              />
              {errors.company_percentage && <p className="text-sm text-red-500">{errors.company_percentage.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner_percentage">Owner Share (%)</Label>
              <Input
                id="owner_percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...register("owner_percentage", {
                  valueAsNumber: true,
                  onChange: (e) => {
                    const value = Number.parseFloat(e.target.value) || 0
                    setValue("company_percentage", 100 - value)
                  },
                })}
              />
              {errors.owner_percentage && <p className="text-sm text-red-500">{errors.owner_percentage.message}</p>}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading || isSubmitting}>
              {(isLoading || isSubmitting) ? "Saving..." : loft ? "Update Loft" : "Create Loft"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Reset Form
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/lofts')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
