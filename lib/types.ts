export type UserRole = 'admin' | 'member' | 'guest';

export type User = {
  id: string;
  email: string | null;
  full_name?: string | null;
  role: UserRole;
  // Add other user-related fields as needed
};

export type AuthSession = {
  user: {
    id: string;
    email: string | null;
    full_name: string | null;
    role: UserRole;
    created_at: string;
    updated_at: string | null;
  };
  token: string;
};

export type LoftStatus = 'available' | 'occupied' | 'maintenance';

export type InternetConnectionType = {
  id: string;
  type: string;
  speed?: string | null;
  provider?: string | null;
  status?: string | null;
  cost?: number | null;
};

export type LoftOwner = {
  id: string;
  name: string;
  ownership_type: 'company' | 'third_party';
};

export type ZoneArea = {
  id: string;
  name: string;
};

export type Loft = {
  id: string;
  name: string;
  address: string;
  description?: string;
  price_per_month: number;
  status: LoftStatus;
  owner_id: string;
  company_percentage: number;
  owner_percentage: number;
  zone_area_id?: string;
  internet_connection_type_id?: string;
  water_customer_code?: string;
  water_contract_code?: string;
  water_meter_number?: string;
  water_correspondent?: string;
  electricity_pdl_ref?: string;
  electricity_customer_number?: string;
  electricity_meter_number?: string;
  electricity_correspondent?: string;
  gas_pdl_ref?: string;
  gas_customer_number?: string;
  gas_meter_number?: string;
  gas_correspondent?: string;
  phone_number?: string;
};

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  user_id: string;
  created_at: string;
  due_date?: string | null;
  assigned_to?: string | null;
};

export type Notification = {
  id: string;
  message: string;
  title: string;
  is_read: boolean;
  created_at: string;
  user_id: string;
  link?: string | null;
};

export type Setting = {
  key: string;
  value: any; // Using any for now, as JSONB can store various types
};

export type Database = any;
