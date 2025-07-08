"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { createZoneArea, updateZoneArea, ZoneArea } from "@/app/actions/zone-areas" // Import updateZoneArea and ZoneArea
import { useRouter } from "next/navigation"

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Zone area name must be at least 2 characters.",
  }),
})

interface ZoneAreaFormProps {
  zoneArea?: ZoneArea; // Optional zoneArea prop for editing
  onSuccess?: () => void; // Callback for success
}

import { useEffect } from "react"; // Import useEffect
// ... other imports

export function ZoneAreaForm({ zoneArea, onSuccess }: ZoneAreaFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: zoneArea?.name || "", // Pre-fill if editing
    },
  });

  // Reset form when zoneArea prop changes (for editing)
  useEffect(() => {
    form.reset({ name: zoneArea?.name || "" });
  }, [zoneArea, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    formData.append("name", data.name);

    let result;
    if (zoneArea) {
      // Update existing zone area
      result = await updateZoneArea(zoneArea.id, formData);
    } else {
      // Create new zone area
      result = await createZoneArea(formData);
    }

    if (result?.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: zoneArea ? "Zone area updated successfully." : "Zone area created successfully.",
      });
      form.reset();
      if (onSuccess) {
        onSuccess();
      } else {
        // router.refresh(); // Revalidate the page to show new/updated zone area
      }
    }
  }

  return (
    <div className="max-w-md my-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zone Area Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Downtown, Uptown" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{zoneArea ? "Update Zone Area" : "Create Zone Area"}</Button>
        </form>
      </Form>
    </div>
  )
}
