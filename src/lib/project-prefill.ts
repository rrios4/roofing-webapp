import * as z from 'zod';
import { addQuoteFormSchema } from '../validations/quote-form-validations';
import { addInvoiceFormSchema } from '../validations/invoice-form-validations';
import { ProjectWithRelations } from '../types/db_types';
import { formatNumber } from './utils';

export type QuoteFormValues = z.infer<typeof addQuoteFormSchema>;
export type InvoiceFormValues = z.infer<typeof addInvoiceFormSchema>;

function lineItemDescription(project: ProjectWithRelations): string {
  const parts = [project.service_details?.name, project.description?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(' — ') : 'Roofing services';
}

function projectAddress(project: ProjectWithRelations) {
  return {
    street: project.street_address || project.address || '',
    city: project.city ?? '',
    state: project.state ?? '',
    zipcode: project.zipcode ?? ''
  };
}

// True when the project's job site differs from the customer's address on file
function addressDiffersFromCustomer(project: ProjectWithRelations): boolean {
  const addr = projectAddress(project);
  if (!addr.street) return false;
  const c = project.customer_details;
  if (!c) return true;
  const norm = (v?: string | null) => (v ?? '').trim().toLowerCase();
  return (
    norm(addr.street) !== norm(c.street_address) ||
    norm(addr.city) !== norm(c.city) ||
    norm(addr.zipcode) !== norm(c.zipcode)
  );
}

function projectReference(project: ProjectWithRelations): string {
  return `Created from project PRJ-${formatNumber(project.project_number ?? 0)}`;
}

export function buildQuoteDefaultsFromProject(
  project: ProjectWithRelations,
  nextQuoteNumber: number
): Partial<QuoteFormValues> {
  const amount = project.estimated_value ?? 0;
  const addr = projectAddress(project);
  const useCustomAddress = addressDiffersFromCustomer(project);

  return {
    project_id: project.id,
    quote_number: nextQuoteNumber,
    customer_id: project.customer ?? 0,
    service_id: project.service ?? undefined,
    line_items: [{ description: lineItemDescription(project), qty: 1, amount, subtotal: amount }],
    custom_street_address: useCustomAddress ? addr.street : '',
    custom_city: useCustomAddress ? addr.city : '',
    custom_state: useCustomAddress ? addr.state : '',
    custom_zipcode: useCustomAddress ? addr.zipcode : '',
    measurement_note: project.sq_ft_measurement ?? '',
    private_note: projectReference(project)
  };
}

export function buildInvoiceDefaultsFromProject(
  project: ProjectWithRelations,
  nextInvoiceNumber: number
): Partial<InvoiceFormValues> {
  const amount = project.contract_amount ?? project.estimated_value ?? 0;
  const addr = projectAddress(project);
  const useBillTo = addressDiffersFromCustomer(project);

  return {
    project_id: project.id,
    invoice_number: nextInvoiceNumber,
    customer_id: project.customer ?? 0,
    service_type_id: project.service ?? 0,
    line_items: [
      {
        description: lineItemDescription(project),
        qty: 1,
        rate: 0,
        amount,
        sq_ft: 0,
        fixed_item: true
      }
    ],
    bill_to: useBillTo,
    bill_to_street_address: useBillTo ? addr.street : '',
    bill_to_city: useBillTo ? addr.city : '',
    bill_to_state: useBillTo ? addr.state : '',
    bill_to_zipcode: useBillTo ? addr.zipcode : '',
    sqft_measurement: project.sq_ft_measurement ?? '',
    private_note: projectReference(project)
  };
}

// Returns the id of the first status whose name matches one of the candidates (case-insensitive)
export function findStatusIdByName(
  statuses: { id: number; name: string }[] | undefined,
  candidates: string[]
): number | undefined {
  if (!statuses) return undefined;
  for (const name of candidates) {
    const match = statuses.find((s) => s.name?.toLowerCase() === name.toLowerCase());
    if (match) return match.id;
  }
  return undefined;
}

// For proposals generated from a project: when the quote has no custom address,
// show the project's job-site address instead of the customer's home address.
// Only affects the in-memory PDF data — the quote row itself is untouched.
export function applyProjectAddressToProposal<
  T extends {
    custom_address?: boolean | null;
    custom_street_address?: string | null;
    custom_city?: string | null;
    custom_state?: string | null;
    custom_zipcode?: string | null;
  }
>(quoteData: T, project: ProjectWithRelations): T {
  const addr = projectAddress(project);
  if (quoteData.custom_address || !addr.street) return quoteData;
  return {
    ...quoteData,
    custom_address: true,
    custom_street_address: addr.street,
    custom_city: addr.city,
    custom_state: addr.state,
    custom_zipcode: addr.zipcode
  };
}
