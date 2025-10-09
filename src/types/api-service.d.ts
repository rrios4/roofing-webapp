export interface Service {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerType {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  customer_type_id: number;
  customer_type?: CustomerType;
  created_at?: string;
  updated_at?: string;
}

export interface Quote {
  id: number;
  customer_id: number;
  customer?: Customer;
  status: string;
  total_amount: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuoteLineItem {
  id: number;
  quote_id: number;
  service_id: number;
  service?: Service;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Invoice {
  id: number;
  customer_id: number;
  customer?: Customer;
  quote_id?: number;
  quote?: Quote;
  status: string;
  total_amount: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceLineItem {
  id: number;
  invoice_id: number;
  service_id: number;
  service?: Service;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoicePayment {
  id: number;
  invoice_id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}
