"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { createLoft } from "@/app/actions/lofts"
import { useState } from "react"

export function SimpleLoftForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    price: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const result = await createLoft({
        name: formData.name,
        address: formData.address,
        price_per_month: Number(formData.price)
      })

      if (result?.success) {
        toast({
          title: "✅ Success",
          description: `Loft "${formData.name}" created successfully`,
          duration: 3000
        })
        setFormData({ name: "", address: "", price: "" }) // Reset form
        setTimeout(() => {
          window.history.back() // Go back to previous page
        }, 1000)
      } else {
        toast({
          title: "❌ Error",
          description: "Failed to create loft - please try again",
          variant: "destructive",
          duration: 5000
        })
      }
    } catch (error) {
      console.error('Error creating loft:', error)
      toast({
        title: "❌ Error",
        description: "Failed to create loft - please check your data and try again",
        variant: "destructive",
        duration: 5000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6">
      <div className="space-y-2">
        <Label htmlFor="name">Loft Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Monthly Price ($)</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Loft"}
      </Button>
    </form>
  )
}
