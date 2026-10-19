import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowRightIcon,
  CalendarIcon,
  DownloadIcon,
  FileBadgeIcon,
  FileTextIcon,
  Loader2Icon,
  MapPinIcon,
  ReceiptIcon,
  RefreshCwIcon,
  UserIcon
} from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { useFetchQuoteById } from '../../hooks/useAPI/use-quotes';
import { useFetchInvoiceById } from '../../hooks/useAPI/use-invoice';
import { useIsMobile } from '../../hooks/useMediaQuery';
import {
  cn,
  formatDateWithAbbreviatedMonth,
  formatMoneyValue,
  formatNumber
} from '../../lib/utils';

export type DocumentRef = { kind: 'quote' | 'invoice'; number: number };

type Props = {
  doc: DocumentRef | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenFull: (doc: DocumentRef) => void;
  onDownload: (doc: DocumentRef) => void;
  onProposal?: (quoteNumber: number) => void;
  isDownloading?: boolean;
  isProposalLoading?: boolean;
};

type LineItem = {
  key: string | number;
  description: string;
  qty: number;
  unit: number;
  total: number;
};

function statusClasses(kind: DocumentRef['kind'], status: string): string {
  const good = kind === 'quote' ? 'Accepted' : 'Paid';
  const bad = kind === 'quote' ? 'Rejected' : 'Overdue';
  if (status === good) return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
  if (status === bad) return 'bg-destructive/10 text-destructive border-destructive/20';
  return 'bg-amber-500/10 text-amber-700 border-amber-200';
}

function fmtDate(value?: string | null): string | null {
  return value ? formatDateWithAbbreviatedMonth(value) : null;
}

function joinAddress(
  street?: string | null,
  city?: string | null,
  state?: string | null,
  zip?: string | null
) {
  const line2 = [city, [state, zip].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  return [street, line2].filter(Boolean).join(', ');
}

function StatTile({
  label,
  value,
  tone
}: {
  label: string;
  value: React.ReactNode;
  tone?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 px-3 py-2.5 min-w-0">
      <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
        {label}
      </p>
      <p className={cn('text-base font-bold tabular-nums mt-0.5 truncate', tone)}>{value}</p>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
      {children}
    </p>
  );
}

export default function DocumentPreviewSheet({
  doc,
  open,
  onOpenChange,
  onOpenFull,
  onDownload,
  onProposal,
  isDownloading,
  isProposalLoading
}: Props) {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const isQuote = doc?.kind === 'quote';

  // Same hooks + cache keys as the dedicated pages, so "Open full" renders instantly
  const quoteQuery = useFetchQuoteById(isQuote ? doc?.number : null);
  const invoiceQuery = useFetchInvoiceById(doc?.kind === 'invoice' ? doc?.number : null);

  const data: any = isQuote ? quoteQuery.quoteById : invoiceQuery.data;
  const isLoading = isQuote ? quoteQuery.isLoading : invoiceQuery.isLoading;
  const isError = isQuote ? quoteQuery.isError : invoiceQuery.isError;

  function retry() {
    if (!doc) return;
    queryClient.invalidateQueries({
      queryKey: [isQuote ? 'quoteById' : 'invoiceById', doc.number]
    });
  }

  const label = doc ? `${isQuote ? 'QT' : 'INV'}-${formatNumber(doc.number)}` : '';
  const statusName: string = data
    ? ((isQuote ? data.quote_status?.name : data.invoice_status?.name) ?? '')
    : '';

  const lineItems: LineItem[] = !data
    ? []
    : isQuote
      ? (data.quote_line_item ?? []).map((li: any) => ({
          key: li.id ?? li.description,
          description: li.description ?? '',
          qty: li.qty ?? 1,
          unit: li.amount ?? 0,
          total: li.subtotal ?? (li.qty ?? 1) * (li.amount ?? 0)
        }))
      : (data.invoice_line_service ?? []).map((li: any) => ({
          key: li.id ?? li.description,
          description: li.description ?? '',
          qty: li.qty ?? 1,
          unit: li.amount ?? 0,
          total: li.amount ?? 0
        }));

  const customer = data?.customer;
  const customerName = customer
    ? `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim()
    : null;
  const address = !data
    ? ''
    : isQuote
      ? data.custom_address
        ? joinAddress(
            data.custom_street_address,
            data.custom_city,
            data.custom_state,
            data.custom_zipcode
          )
        : joinAddress(customer?.street_address, customer?.city, customer?.state, customer?.zipcode)
      : data.bill_to && data.bill_to_street_address
        ? joinAddress(
            data.bill_to_street_address,
            data.bill_to_city,
            data.bill_to_state,
            data.bill_to_zipcode
          )
        : joinAddress(customer?.street_address, customer?.city, customer?.state, customer?.zipcode);

  const total = Number(data?.total ?? 0);
  const amountDue = Number(data?.amount_due ?? total);
  const paid = Math.max(total - amountDue, 0);
  const issued = fmtDate(isQuote ? (data?.quote_date ?? data?.issue_date) : data?.issue_date);
  const secondaryDateValue = isQuote ? data?.expiration_date : data?.due_date;
  const secondaryDate = fmtDate(secondaryDateValue);
  const isPastDue =
    !isQuote &&
    !!secondaryDateValue &&
    amountDue > 0 &&
    new Date(secondaryDateValue).getTime() < Date.now();

  const Icon = isQuote ? FileTextIcon : ReceiptIcon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className={cn(
          'p-0 gap-0 flex flex-col',
          isMobile
            ? 'max-h-[92dvh] rounded-t-2xl pb-[env(safe-area-inset-bottom)]'
            : 'w-full sm:max-w-md'
        )}>
        {isMobile && (
          <div className="flex justify-center pt-2.5 pb-1 flex-shrink-0">
            <div className="h-1.5 w-10 rounded-full bg-muted-foreground/25" />
          </div>
        )}

        {/* Header */}
        <div className="flex-shrink-0 px-5 pt-3 sm:pt-5 pb-4 pr-12 border-b border-border">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                'h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0',
                isQuote ? 'bg-sky-500/10 text-sky-600' : 'bg-teal-500/10 text-teal-600'
              )}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <SheetTitle className="text-lg leading-tight">{label}</SheetTitle>
                {statusName && (
                  <span
                    className={cn(
                      'inline-flex items-center px-1.5 py-0 text-[10px] font-semibold rounded border',
                      statusClasses(doc?.kind ?? 'quote', statusName)
                    )}>
                    {statusName}
                  </span>
                )}
              </div>
              <SheetDescription className="text-xs mt-0.5 flex items-center gap-1.5 flex-wrap">
                <CalendarIcon className="h-3 w-3" />
                {issued ? `Issued ${issued}` : 'No issue date'}
                {secondaryDate && (
                  <span className={cn(isPastDue && 'text-destructive font-medium')}>
                    · {isQuote ? 'Expires' : 'Due'} {secondaryDate}
                  </span>
                )}
              </SheetDescription>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4 flex flex-col gap-5">
          {isLoading && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
              </div>
              <Skeleton className="h-14 rounded-xl" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 rounded-lg" />
                <Skeleton className="h-10 rounded-lg" />
                <Skeleton className="h-10 rounded-lg" />
              </div>
            </>
          )}

          {isError && !isLoading && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Couldn't load this {isQuote ? 'quote' : 'invoice'}.
              </p>
              <Button variant="outline" size="sm" onClick={retry}>
                <RefreshCwIcon className="h-3.5 w-3.5 mr-2" />
                Retry
              </Button>
            </div>
          )}

          {data && !isLoading && (
            <>
              {/* Summary */}
              <div className="grid grid-cols-2 gap-2">
                <StatTile label="Total" value={`$${formatMoneyValue(total)}`} />
                {isQuote ? (
                  <StatTile label="Expires" value={secondaryDate ?? '—'} />
                ) : (
                  <StatTile
                    label="Balance due"
                    value={`$${formatMoneyValue(amountDue)}`}
                    tone={
                      amountDue > 0 ? (isPastDue ? 'text-destructive' : '') : 'text-emerald-600'
                    }
                  />
                )}
                {!isQuote && paid > 0 && (
                  <StatTile
                    label="Paid"
                    value={`$${formatMoneyValue(paid)}`}
                    tone="text-emerald-600"
                  />
                )}
              </div>

              {/* Bill to */}
              <div>
                <SectionLabel>Bill to</SectionLabel>
                <div className="rounded-xl border border-border px-3 py-2.5 flex flex-col gap-1.5">
                  <p className="flex items-center gap-2 text-sm font-medium min-w-0">
                    <UserIcon className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                    <span className="truncate">
                      {customerName || (
                        <span className="italic text-muted-foreground">No customer</span>
                      )}
                    </span>
                  </p>
                  {address && (
                    <p className="flex items-start gap-2 text-xs text-muted-foreground">
                      <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0 mt-px" />
                      <span>{address}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Line items */}
              <div>
                <SectionLabel>
                  Line items {lineItems.length > 0 && `(${lineItems.length})`}
                </SectionLabel>
                {lineItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No line items</p>
                ) : (
                  <div className="rounded-xl border border-border divide-y divide-border">
                    {lineItems.map((li) => (
                      <div key={li.key} className="flex items-start gap-3 px-3 py-2.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-snug break-words">
                            {li.description || (
                              <span className="italic text-muted-foreground">No description</span>
                            )}
                          </p>
                          {li.qty > 1 && (
                            <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                              {li.qty} × ${formatMoneyValue(li.unit)}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-semibold tabular-nums flex-shrink-0">
                          ${formatMoneyValue(li.total)}
                        </span>
                      </div>
                    ))}
                    {data.subtotal != null && Number(data.subtotal) !== total && (
                      <div className="flex justify-between px-3 py-2 text-sm text-muted-foreground">
                        <span>Subtotal</span>
                        <span className="tabular-nums">
                          ${formatMoneyValue(Number(data.subtotal))}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between px-3 py-2.5 text-sm font-bold bg-muted/40 rounded-b-xl">
                      <span>Total</span>
                      <span className="tabular-nums">${formatMoneyValue(total)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Payments (invoices) */}
              {!isQuote && (
                <div>
                  <SectionLabel>Payments</SectionLabel>
                  {(data.invoice_payment ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No payments recorded</p>
                  ) : (
                    <div className="rounded-xl border border-border divide-y divide-border">
                      {data.invoice_payment.map((pmt: any) => (
                        <div key={pmt.id} className="flex items-center gap-3 px-3 py-2.5">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {pmt.payment_method || 'Payment'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {fmtDate(pmt.date_received) ?? '—'}
                            </p>
                          </div>
                          <span className="text-sm font-semibold tabular-nums text-emerald-600">
                            ${formatMoneyValue(Number(pmt.amount ?? 0))}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Customer-facing note */}
              {data.public_note && (
                <div>
                  <SectionLabel>Note</SectionLabel>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed rounded-xl bg-muted/30 border border-border px-3 py-2.5">
                    {data.public_note}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer — call to action */}
        {doc && (
          <div className="flex-shrink-0 border-t border-border bg-card px-5 pt-3 pb-4 flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-10"
                disabled={isDownloading || !data}
                onClick={() => onDownload(doc)}>
                {isDownloading ? (
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <DownloadIcon className="h-4 w-4 mr-2" />
                )}
                PDF
              </Button>
              {isQuote && onProposal && (
                <Button
                  variant="outline"
                  className="flex-1 h-10"
                  disabled={isProposalLoading || !data}
                  onClick={() => onProposal(doc.number)}>
                  {isProposalLoading ? (
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileBadgeIcon className="h-4 w-4 mr-2" />
                  )}
                  Proposal
                </Button>
              )}
            </div>
            <Button className="w-full h-11 sm:h-10" onClick={() => onOpenFull(doc)}>
              Open full {isQuote ? 'quote' : 'invoice'}
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
