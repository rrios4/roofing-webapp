// ---------------------------------------------------------
// Base type for customer creation/updates (excludes generated fields)
// ---------------------------------------------------------

export type CustomerInsert = {
  customer_type_id: number;
  first_name: string;
  last_name: string;
  street_address: string;
  city: string;
  state: string;
  zipcode: string;
  phone_number: string;
  email: string;
  company_name?: string; // Optional since not all customers are companies
};

// Full customer type including generated fields
export type Customer = CustomerInsert & {
  id: number;
  created_at: string; // timestamp with time zone stored as ISO string
  updated_at: string; // timestamp without time zone stored as ISO string
};

// Type for customer with joined customer_type
export type CustomerWithType = Customer & {
  customer_type: {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
  };
};

// ---------------------------------------------------------
// Base type for customer type creation/updates (excludes generated fields)
// ---------------------------------------------------------

export type CustomerTypeInsert = {
  name: string;
  description?: string; // Optional field
};

// Full customer type including generated fields
export type CustomerType = CustomerTypeInsert & {
  id: number;
  created_at: string; // timestamptz stored as ISO string
  updated_at: string; // timestamp stored as ISO string
};

// ---------------------------------------------------------
// Base type for invoice creation/updates (excludes generated fields)
// ---------------------------------------------------------

export type InvoiceInsert = {
  invoice_number: number;
  customer_id: number;
  service_type_id: number;
  invoice_status_id: number;
  invoice_date: string; // date stored as ISO string
  issue_date: string; // date stored as ISO string
  due_date: string; // date stored as ISO string
  subtotal: number; // float8
  total: number; // float8
  sqft_measurement: string;
  note?: string;
  bill_from_street_address: string;
  bill_from_city: string;
  bill_from_state: string;
  bill_from_zipcode: string;
  bill_from_email: string;
  bill_to_street_address: string;
  bill_to_city: string;
  bill_to_state: string;
  bill_to_zipcode: string;
  cust_note?: string; // Customer-facing note
  amount_due: number; // float8 - total minus payments
  bill_to: boolean; // Flag for custom billing info display
  converted_from_quote_number?: number;
  private_note?: string; // Internal-only note
  public_note?: string; // Customer-visible note
};

// Full invoice type including generated fields
export type Invoice = InvoiceInsert & {
  id: number;
  created_at: string; // timestamptz stored as ISO string
  updated_at: string; // timestamp stored as ISO string
};

// Type for invoice with joined relations
export type InvoiceWithRelations = Invoice & {
  customer: Customer;
  service: ServiceType;
  service_type: ServiceType;
  invoice_status: InvoiceStatus;
};

// ---------------------------------------------------------
// Base type for invoice line service creation/updates (excludes generated fields)
// ---------------------------------------------------------

export type InvoiceLineServiceInsert = {
  invoice_id: number;
  service_id: number;
  sq_ft: number; // float8
  qty: number;
  rate: number; // float8
  amount: number; // float8
  description?: string; // Custom description of the service
  fixed_item: boolean; // Flag for using fixed amount vs rate
};

// Full invoice line service type including generated fields
export type InvoiceLineService = InvoiceLineServiceInsert & {
  id: number;
  created_at: string; // timestamptz stored as ISO string
  updated_at: string; // timestamp stored as ISO string
};

// Type for invoice line service with joined relations
export type InvoiceLineServiceWithRelations = InvoiceLineService & {
  invoice: Invoice;
  service: Service; // You'll need to define the Service type
};

// ---------------------------------------------------------
// Base type for invoice payment creation/updates (excludes generated fields)
// ---------------------------------------------------------

export type InvoicePaymentInsert = {
  invoice_id: number;
  payment_method: string;
  amount: number; // float8
  date_received: string; // date stored as ISO string
};

// Full invoice payment type including generated fields
export type InvoicePayment = InvoicePaymentInsert & {
  id: number;
  created_at: string; // timestamptz stored as ISO string
  updated_at: string; // timestamp stored as ISO string
};

// Type for invoice payment with joined relations
export type InvoicePaymentWithRelations = InvoicePayment & {
  invoice: Invoice;
};

// ---------------------------------------------------------
// Base type for invoice status creation/updates (excludes generated fields)
// ---------------------------------------------------------

export type InvoiceStatusInsert = {
  name: string;
  description?: string; // Optional field
};

// Full invoice status type including generated fields
export type InvoiceStatus = InvoiceStatusInsert & {
  id: number;
  created_at: string; // timestamptz stored as ISO string
  updated_at: string; // timestamp stored as ISO string
};

// ---------------------------------------------------------
// Base type for quote creation/updates (excludes generated fields)
// ---------------------------------------------------------

export type QuoteInsert = {
  quote_number: number;
  customer_id: number;
  status_id: number;
  service_id: number;
  issue_date: string; // date stored as ISO string
  expiration_date: string; // date stored as ISO string
  quote_date: string; // date stored as ISO string
  subtotal: number; // float8
  total: number; // float8
  invoiced_total: number; // float8
  note?: string;
  measurement_note?: string; // Metric of roof and estimated price
  cust_note?: string; // Customer-facing note
  custom_street_address?: string;
  custom_city?: string;
  custom_state?: string;
  custom_zipcode?: string;
  custom_address: boolean; // Flag for using custom address
  converted: boolean; // Flag indicating if quote was converted to invoice
  private_note?: string; // Internal-only note
  public_note?: string; // Customer-visible note
};

// Full quote type including generated fields
export type Quote = QuoteInsert & {
  id: number;
  created_at: string; // timestamptz stored as ISO string
  updated_at: string; // timestamptz stored as ISO string
};

// Type for quote with joined relations
export type QuoteWithRelations = Quote & {
  customer: Customer;
  status: QuoteStatus; // You'll need to define QuoteStatus type
  service: Service; // You'll need to define Service type
};

// ---------------------------------------------------------
// Base type for quote line item creation/updates (excludes generated fields)
// ---------------------------------------------------------

export type QuoteLineItemInsert = {
  quote_id: number;
  service_id: number;
  qty: number; // int8
  amount: number; // float8
  rate: number; // float8
  sq_ft: number; // float8
  description?: string;
  fixed_item: boolean; // Flag for using fixed amount vs rate
  subtotal: number; // float8
};

// Full quote line item type including generated fields
export type QuoteLineItem = QuoteLineItemInsert & {
  id: number;
  created_at: string; // timestamptz stored as ISO string
  updated_at: string; // timestamp stored as ISO string
};

// Type for quote line item with joined relations
export type QuoteLineItemWithRelations = QuoteLineItem & {
  quote: Quote;
  service: Service; // You'll need to define Service type
};

// ---------------------------------------------------------
// Base type for quote status creation/updates (excludes generated fields)
// ---------------------------------------------------------

export type QuoteStatusInsert = {
  name: string;
  description?: string; // Optional field
};

// Full quote status type including generated fields
export type QuoteStatus = QuoteStatusInsert & {
  id: number;
  created_at: string; // timestamptz stored as ISO string
  updated_at: string; // timestamptz stored as ISO string
};

// ---------------------------------------------------------
// Base type for service creation/updates (excludes generated fields)
// ---------------------------------------------------------

export type ServiceInsert = {
  name: string;
  description?: string; // Optional field
  default_price?: string; // Optional - Stores price info like "$300 per sq" or "$100 per hour"
};

// Full service type including generated fields
export type Service = ServiceInsert & {
  id: number;
  created_at: string; // timestamptz stored as ISO string
  updated_at: string; // timestamp stored as ISO string
};

// ---------------------------------------------------------
// Base type for quote request creation/updates (excludes generated fields)
// ---------------------------------------------------------

export type QuoteRequestInsert = {
  service_type_id: number;
  customer_typeID: number;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  email: string;
  phone_number: string; // Used for scheduling measurement visits
  custom_service?: string; // Optional custom service request
  requested_date: string; // date stored as ISO string
  est_request_status_id: number;
};

// Full quote request type including generated fields
export type QuoteRequest = QuoteRequestInsert & {
  id: number;
  created_at: string; // timestamptz stored as ISO string
  updated_at: string; // timestamptz stored as ISO string - tracks modification date
};

// Type for quote request with joined relations
export type QuoteRequestWithRelations = QuoteRequest & {
  service_type: ServiceType;
  customer_type: CustomerType;
  status: QuoteRequestStatus;
};

// ---------------------------------------------------------
// Base type for quote request status creation/updates (excludes generated fields)
// ---------------------------------------------------------

export type QuoteRequestStatusInsert = {
  name: string;
  description?: string; // Optional field
};

// Full quote request status type including generated fields
export type QuoteRequestStatus = QuoteRequestStatusInsert & {
  id: number;
  created_at: string; // timestamptz stored as ISO string
  updated_at: string; // timestamp stored as ISO string
};

// Currently under development and not yet implemented
// ---------------------------------------------------------
// Base type for project creation/updates (excludes generated fields)
// ---------------------------------------------------------

export type ProjectInsert = {
  project_number: number;
  address: string;
  start_date: string; // date stored as ISO string
  end_date: string; // date stored as ISO string
  status: string;
  service: number; // Foreign key to service table
  customer: number; // Foreign key to customer table
};

// Full project type including generated fields
export type Project = ProjectInsert & {
  id: string; // uuid stored as string
  created_at: string; // timestamptz stored as ISO string
  updated_at: string; // timestamp stored as ISO string
};

// Type for project with joined relations
export type ProjectWithRelations = Project & {
  service_details: Service;
  customer_details: Customer;
};
