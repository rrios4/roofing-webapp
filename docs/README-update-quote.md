# Update Quote Form

This directory contains components for updating existing quotes in the roofing webapp.

## Components

### UpdateQuoteForm

The main form component for updating quotes. It uses React Hook Form with Zod validation.

**Props:**

- `quote: Quote` - The existing quote object to be updated
- `quoteLineItems?: QuoteLineItem[]` - Optional array of quote line items
- `onSuccess?: () => void` - Optional callback function called after successful update

**Features:**

- Pre-populated form fields with existing quote data
- Real-time subtotal and total calculations
- Dynamic line items with add/remove functionality
- Optional fields with toggle switches (custom address, notes, measurements)
- Form validation using Zod schema
- Optimistic updates with React Query

### UpdateQuoteSheet

A wrapper component that provides a sheet/modal interface for the UpdateQuoteForm.

**Props:**

- `quote: Quote` - The quote object to be updated
- `trigger?: React.ReactNode` - Optional custom trigger element

## Usage Examples

### Basic Usage with UpdateQuoteSheet

```tsx
import UpdateQuoteSheet from './components/forms/update-quote-sheet';

// In your component
<UpdateQuoteSheet quote={selectedQuote} trigger={<Button>Edit Quote</Button>} />;
```

### Direct Usage with UpdateQuoteForm

```tsx
import UpdateQuoteForm from './components/forms/update-quote-form';

// In your component
<UpdateQuoteForm
  quote={quote}
  quoteLineItems={lineItems}
  onSuccess={() => {
    console.log('Quote updated successfully');
    // Handle success (close modal, refresh data, etc.)
  }}
/>;
```

## Schema

The form uses the `updateQuoteFormSchema` from `validations/quote-form-validations.ts` which includes:

- Required fields: id, quote_number, customer_id, service_id, status_id, quote_date, expiration_date
- Optional fields: notes, custom address fields, line items
- Line items with validation for description, quantity, amount, and subtotal

## API Integration

The form integrates with Supabase and uses React Query for:

- Updating quote records
- Managing quote line items (delete existing, insert new)
- Cache invalidation and optimistic updates
- Error handling and loading states

## Dependencies

- React Hook Form for form management
- Zod for validation
- React Query for API state management
- Supabase for database operations
- Radix UI components for form elements
- date-fns for date formatting
