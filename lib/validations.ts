import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loftSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  price_per_month: z.number().min(0, "Price must be a positive number"),
  status: z.enum(['available', 'occupied', 'maintenance']),
  owner_id: z.string().min(1, "Owner is required"),
  company_percentage: z.number().min(0).max(100).step(0.01),
  owner_percentage: z.number().min(0).max(100).step(0.01),
  zone_area_id: z.string().uuid("Invalid Zone Area ID").optional(),
  internet_connection_type_id: z.string().uuid("Invalid Internet Connection Type ID").optional(),
  water_customer_code: z.string().optional(),
  water_contract_code: z.string().optional(),
  water_meter_number: z.string().optional(),
  water_correspondent: z.string().optional(),
  electricity_pdl_ref: z.string().optional(),
  electricity_customer_number: z.string().optional(),
  electricity_meter_number: z.string().optional(),
  electricity_correspondent: z.string().optional(),
  gas_pdl_ref: z.string().optional(),
  gas_customer_number: z.string().optional(),
  gas_meter_number: z.string().optional(),
  gas_correspondent: z.string().optional(),
  phone_number: z.string().optional(),
});

export type LoftFormData = z.infer<typeof loftSchema>;

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  status: z.enum(['todo', 'in_progress', 'completed']),
  due_date: z.string().nullable().optional(), // Change to string to match HTML input
  assigned_to: z.string().nullable().optional(), // Allow null for unassigned
  team_id: z.string().nullable().optional(),
  loft_id: z.string().nullable().optional()
});

export const transactionSchema = z.object({
  amount: z.number().min(0.01, "Amount must be positive"),
  transaction_type: z.enum(['income', 'expense']),
  status: z.enum(['pending', 'completed', 'failed']),
  description: z.string().optional(),
  date: z.string(),
  category: z.string().optional(),
  loft_id: z.string().optional(),
  currency_id: z.string().uuid("Invalid currency ID").optional(),
  payment_method_id: z.string().uuid("Invalid payment method ID").optional(),
  ratio_at_transaction: z.number().nullable().optional(), // Store the ratio of selected currency to default at time of transaction
  equivalent_amount_default_currency: z.number().nullable().optional(), // Store the equivalent amount in default currency
});

export type Transaction = z.infer<typeof transactionSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;

export const loftOwnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  ownership_type: z.enum(['company', 'third_party'])
});

export type LoftOwnerFormData = z.infer<typeof loftOwnerSchema>;
