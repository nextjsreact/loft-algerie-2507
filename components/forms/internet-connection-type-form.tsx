"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InternetConnectionType } from "@/lib/types";
import {
  createInternetConnectionType,
  updateInternetConnectionType,
} from "@/app/actions/internet-connections";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
  type: z.string().min(1, "Type is required"),
  speed: z.string().nullable().optional(),
  provider: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  cost: z.coerce.number().nullable().optional(),
  created_at: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InternetConnectionTypeFormProps {
  initialData?: InternetConnectionType;
  onCreated?: (newType: InternetConnectionType) => void;
}

export function InternetConnectionTypeForm({
  initialData,
  onCreated,
}: InternetConnectionTypeFormProps) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialData?.type || "",
      speed: initialData?.speed || "",
      provider: initialData?.provider || "",
      status: initialData?.status || "",
      cost: initialData?.cost || 0,
      created_at: initialData?.created_at || new Date().toISOString(),
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      if (initialData) {
        await updateInternetConnectionType(initialData.id, values);
        toast.success("Internet connection type updated successfully.");
      } else {
        const result = await createInternetConnectionType(
          values.type,
          values.speed,
          values.provider,
          values.status,
          values.cost
        );
        if (result.data && onCreated) {
          onCreated(result.data);
        }
        toast.success("Internet connection type created successfully.");
        form.reset();
      }
      router.push("/settings/internet-connections");
      router.refresh();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Fiber, ADSL" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="speed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Speed</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 100 Mbps" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Djezzy" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Input placeholder="e.g. active" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g. 2500.00" {...field} value={field.value ?? 0} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{initialData ? "Save changes" : "Create"}</Button>
      </form>
    </Form>
  );
}
