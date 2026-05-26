import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  PencilIcon,
  CalendarIcon,
  MailIcon,
  ClockIcon,
  ExternalLinkIcon,
  ShieldIcon,
  FileCheckIcon,
  FileTextIcon,
  Loader2Icon,
  XIcon,
  UsersIcon,
  Settings2Icon,
  PhoneIcon,
  MapPinIcon,
  WrenchIcon,
  TagIcon,
  RulerIcon,
  AlignLeftIcon,
  ListChecksIcon,
  ImageIcon,
  UserIcon,
  HashIcon,
  Building2Icon,
  DollarSignIcon,
  HomeIcon,
  StickyNoteIcon,
  ReceiptIcon,
  LinkIcon,
  PlusIcon,
  DownloadIcon,
} from 'lucide-react';
import {
  abbreviateName,
  cn,
  formatDateWithAbbreviatedMonth,
  formatMoneyValue,
  formatNumber,
  getAvatarColor,
} from '../../lib/utils';
import { ProjectWithRelations } from '../../types/db_types';
import UpdateProjectSheet from '../forms/update-project-sheet';
import { useGoogleService } from '../../hooks/useGoogleService';
import { useAuth } from '../../hooks/useAuth';
import {
  useFetchInvoicesByProjectId,
  useFetchAllInvoices,
  useLinkInvoiceToProject,
  useUnlinkInvoiceFromProject,
} from '../../hooks/useAPI/use-invoice';
import {
  useFetchQuotesByProjectId,
  useFetchQuotes,
  useLinkQuoteToProject,
  useUnlinkQuoteFromProject,
} from '../../hooks/useAPI/use-quotes';
import { fetchInvoiceById } from '../../services/api/invoice-service';
import { fetchQuoteById } from '../../services/api/quote-service';
import { pdf } from '@react-pdf/renderer';
import { ModernInvoiceDocument } from '../pdf-render/modern-invoice-doc';
import { ModernQuoteDocument } from '../pdf-render/modern-quote-doc-final';
import { transformInvoiceForPDF, transformQuoteForPDF, getInvoicePDFFilename } from '../../lib/pdf-utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';

type Props = {
  project: ProjectWithRelations | null;
  open: boolean;
  onClose: () => void;
};

function fmtRange(start?: string | null, end?: string | null) {
  if (!start && !end) return 'Not scheduled';
  if (start && !end) return `From ${formatDateWithAbbreviatedMonth(start)}`;
  if (!start && end) return `Through ${formatDateWithAbbreviatedMonth(end)}`;
  return `${formatDateWithAbbreviatedMonth(start!)} – ${formatDateWithAbbreviatedMonth(end!)}`;
}

function InfoCard({
  iconBg,
  iconText,
  icon,
  title,
  className,
  headerExtra,
  children,
}: {
  iconBg: string;
  iconText: string;
  icon: React.ReactNode;
  title: string;
  className?: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('rounded-xl border border-border overflow-hidden flex flex-col', className)}>
      <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2.5 flex-shrink-0">
        <div
          className={`h-6 w-6 rounded-md flex items-center justify-center flex-shrink-0 ${iconBg} ${iconText}`}
        >
          {icon}
        </div>
        <span className="text-sm font-semibold flex-1">{title}</span>
        {headerExtra}
      </div>
      <div className="p-4 flex-1">{children}</div>
    </div>
  );
}

function KVRow({
  label,
  icon,
  value,
}: {
  label: string;
  icon?: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground flex items-center gap-1">
        {icon && <span className="opacity-60">{icon}</span>}
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function GoogleDriveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 87.3 78">
      <path
        d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
        fill="#0066da"
      />
      <path
        d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"
        fill="#00ac47"
      />
      <path
        d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
        fill="#ea4335"
      />
      <path
        d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
        fill="#00832d"
      />
      <path
        d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
        fill="#2684fc"
      />
      <path
        d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
        fill="#ffba00"
      />
    </svg>
  );
}

function EmptyTab({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-16 border border-dashed border-border rounded-xl text-sm text-muted-foreground">
      {label}
    </div>
  );
}

function ActivityEntry({ title, timestamp }: { title: string; timestamp?: string | null }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
        <ClockIcon className="h-3.5 w-3.5" />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {timestamp
            ? new Date(timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })
            : '—'}
        </p>
      </div>
    </div>
  );
}

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  webViewLink?: string;
};

export default function ProjectFullDialog({ project, open, onClose }: Props) {
  const [tab, setTab] = useState('overview');
  const [docs, setDocs] = useState<DriveFile[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [docsError, setDocsError] = useState<string | null>(null);
  const [docsFetched, setDocsFetched] = useState(false);
  const [needsDrivePermission, setNeedsDrivePermission] = useState(false);

  const { getDriveFiles, isInitialized: driveReady } = useGoogleService();
  const { googleLogin } = useAuth();

  const { data: linkedInvoices, isLoading: invoicesLoading } = useFetchInvoicesByProjectId(
    open ? project?.id : undefined
  );
  const { data: linkedQuotes, isLoading: quotesLoading } = useFetchQuotesByProjectId(
    open ? project?.id : undefined
  );
  const { data: allInvoices } = useFetchAllInvoices();
  const { quotes: allQuotes } = useFetchQuotes();

  const linkInvoice = useLinkInvoiceToProject(project?.id ?? '');
  const unlinkInvoice = useUnlinkInvoiceFromProject(project?.id ?? '');
  const linkQuote = useLinkQuoteToProject(project?.id ?? '');
  const unlinkQuote = useUnlinkQuoteFromProject(project?.id ?? '');

  const [invoicePickerOpen, setInvoicePickerOpen] = React.useState(false);
  const [quotePickerOpen, setQuotePickerOpen] = React.useState(false);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = React.useState<number | null>(null);
  const [downloadingQuoteId, setDownloadingQuoteId] = React.useState<number | null>(null);

  async function handleDownloadInvoice(invoiceNumber: number) {
    setDownloadingInvoiceId(invoiceNumber);
    try {
      const full = await fetchInvoiceById(invoiceNumber);
      const data = transformInvoiceForPDF(full);
      const blob = await pdf(<ModernInvoiceDocument invoice={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = getInvoicePDFFilename(data);
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Invoice PDF generation failed', e);
    } finally {
      setDownloadingInvoiceId(null);
    }
  }

  async function handleDownloadQuote(quoteNumber: number) {
    setDownloadingQuoteId(quoteNumber);
    try {
      const full = await fetchQuoteById(quoteNumber);
      if (!full) return;
      const data = transformQuoteForPDF(full);
      const blob = await pdf(<ModernQuoteDocument quote={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QT-${String(data.quote_number ?? 0).padStart(4, '0')}_${data.customer ? `${data.customer.first_name}_${data.customer.last_name}` : 'Unknown'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Quote PDF generation failed', e);
    } finally {
      setDownloadingQuoteId(null);
    }
  }

  useEffect(() => {
    if (open) {
      setTab('overview');
      setDocs([]);
      setDocsFetched(false);
      setDocsError(null);
      setNeedsDrivePermission(false);
    }
  }, [open, project?.id]);

  async function handleTabChange(newTab: string) {
    setTab(newTab);
    if (newTab === 'documents' && !docsFetched && project?.drive_folder_id) {
      setDocsLoading(true);
      setDocsError(null);
      try {
        const folderId = project.drive_folder_id;
        const q = `'${folderId}' in parents and (mimeType='application/pdf' or mimeType='application/vnd.openxmlformats-officedocument.wordprocessingml.document') and trashed=false`;
        const files = await getDriveFiles(q, 50);
        setDocs(files);
      } catch (e) {
        const msg = e instanceof Error ? e.message : '';
        if (
          msg.includes('403') ||
          msg.toLowerCase().includes('insufficient') ||
          msg.includes('PERMISSION_DENIED')
        ) {
          setNeedsDrivePermission(true);
        } else {
          setDocsError('Failed to load documents from Drive.');
        }
      } finally {
        setDocsLoading(false);
        setDocsFetched(true);
      }
    }
  }

  if (!project) return null;

  const docCount = (linkedInvoices?.length ?? 0) + (linkedQuotes?.length ?? 0);
  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'photos', label: 'Photos (0)' },
    { id: 'documents', label: docCount > 0 ? `Documents (${docCount})` : 'Documents' },
    { id: 'tasks', label: 'Tasks (0)' },
    { id: 'activity', label: 'Activity' },
  ];

  const customer = project.customer_details;
  const hasCustomer = !!customer;
  const displayName = hasCustomer
    ? `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim()
    : null;
  const typeName = project.project_type?.name;
  const statusName = project.project_status?.name;
  const address = project.street_address || project.address || '';
  const cityLine = [project.city, project.state, project.zipcode].filter(Boolean).join(', ');
  const avatarColors = displayName ? getAvatarColor(displayName) : null;

  const dash = <em className="not-italic text-muted-foreground">—</em>;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="w-[92vw] max-w-[92vw] h-[90vh] max-h-[90vh] p-0 flex flex-col gap-0 overflow-hidden [&>button.absolute]:hidden">

        {/* ── Header ───────────────────────────────────────── */}
        <DialogHeader className="flex-shrink-0 px-6 py-4 border-b bg-card">
          <div className="flex items-center gap-4 min-w-0">
            {hasCustomer ? (
              <Avatar className="h-11 w-11 flex-shrink-0">
                <AvatarFallback
                  className={`text-sm font-semibold ${avatarColors?.bg ?? ''} ${avatarColors?.text ?? ''}`}
                >
                  {abbreviateName(displayName!)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-11 w-11 flex-shrink-0 rounded-full border border-dashed border-border bg-muted flex items-center justify-center text-muted-foreground">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle
                  className={`text-lg leading-tight ${!hasCustomer ? 'text-muted-foreground italic font-normal' : ''}`}
                >
                  {displayName ?? 'No customer assigned'}
                </DialogTitle>
                {typeName && (
                  <Badge
                    variant={typeName === 'Commercial' ? 'secondary' : 'default'}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {typeName}
                  </Badge>
                )}
                {statusName && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {statusName}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                #{formatNumber(project.project_number ?? 0)}
                {project.service_details?.name ? ` · ${project.service_details.name}` : ''}
                {' · '}
                {fmtRange(project.start_date, project.end_date)}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Reschedule
              </Button>
              <Button variant="outline" size="sm">
                <MailIcon className="h-4 w-4 mr-2" />
                Message
              </Button>
              <UpdateProjectSheet
                project={project}
                trigger={
                  <Button variant="outline" size="sm">
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit project
                  </Button>
                }
              />
              <DialogClose asChild>
                <Button size="sm">
                  <XIcon className="h-4 w-4 mr-2" />
                  Close
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>

        {/* ── Tabs ─────────────────────────────────────────── */}
        <Tabs value={tab} onValueChange={handleTabChange} className="flex flex-col flex-1 min-h-0">
          <TabsList className="flex-shrink-0 w-full justify-start rounded-none border-b bg-card px-4 h-auto py-0 gap-1">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-sm py-3 px-3"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 overflow-y-auto bg-background">

            {/* ── Overview ───────────────────────────────────── */}
            <TabsContent value="overview" className="mt-0 p-6">
              <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4">

                {/* Customer — col-span-2 */}
                <InfoCard
                  className="col-span-2"
                  iconBg="bg-violet-500/10"
                  iconText="text-violet-600"
                  icon={<UsersIcon className="h-3.5 w-3.5" />}
                  title="Customer"
                >
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <KVRow
                      icon={<UserIcon className="h-3 w-3" />}
                      label="Name"
                      value={displayName ?? dash}
                    />
                    <KVRow
                      icon={<PhoneIcon className="h-3 w-3" />}
                      label="Phone"
                      value={
                        customer?.phone_number ? (
                          <a href={`tel:${customer.phone_number}`} className="hover:underline">
                            {customer.phone_number}
                          </a>
                        ) : (
                          dash
                        )
                      }
                    />
                    <KVRow
                      icon={<MailIcon className="h-3 w-3" />}
                      label="Email"
                      value={
                        customer?.email ? (
                          <a href={`mailto:${customer.email}`} className="hover:underline truncate block">
                            {customer.email}
                          </a>
                        ) : (
                          dash
                        )
                      }
                    />
                    <KVRow
                      icon={<MapPinIcon className="h-3 w-3" />}
                      label="Address"
                      value={
                        <span>
                          {address || dash}
                          {cityLine && (
                            <span className="block text-xs text-muted-foreground">{cityLine}</span>
                          )}
                        </span>
                      }
                    />
                    <div className="col-span-2">
                      <KVRow
                        icon={<HomeIcon className="h-3 w-3" />}
                        label="Property Owner"
                        value={project.property_owner_name ?? dash}
                      />
                    </div>
                  </div>
                </InfoCard>

                {/* Financials hero — col-span-1 */}
                <InfoCard
                  iconBg="bg-amber-500/10"
                  iconText="text-amber-600"
                  icon={<DollarSignIcon className="h-3.5 w-3.5" />}
                  title="Financials"
                >
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                        Estimated value
                      </p>
                      {project.estimated_value != null ? (
                        <p className="text-3xl font-bold leading-tight">
                          ${formatMoneyValue(project.estimated_value)}
                        </p>
                      ) : (
                        <p className="text-lg font-medium text-muted-foreground italic">Not set</p>
                      )}
                    </div>
                    {project.contract_amount != null && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                          Contract amount
                        </p>
                        <p className="text-xl font-semibold">
                          ${formatMoneyValue(project.contract_amount)}
                        </p>
                      </div>
                    )}
                  </div>
                </InfoCard>

                {/* Project Details — col-span-2 */}
                <InfoCard
                  className="col-span-2"
                  iconBg="bg-sky-500/10"
                  iconText="text-sky-600"
                  icon={<Settings2Icon className="h-3.5 w-3.5" />}
                  title="Project Details"
                >
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <KVRow
                      icon={<WrenchIcon className="h-3 w-3" />}
                      label="Service"
                      value={project.service_details?.name ?? dash}
                    />
                    <KVRow
                      icon={<TagIcon className="h-3 w-3" />}
                      label="Source"
                      value={project.project_source?.name ?? dash}
                    />
                    <KVRow
                      icon={<CalendarIcon className="h-3 w-3" />}
                      label="Schedule"
                      value={fmtRange(project.start_date, project.end_date)}
                    />
                    <KVRow
                      icon={<RulerIcon className="h-3 w-3" />}
                      label="Sq ft"
                      value={project.sq_ft_measurement ?? dash}
                    />
                    {project.description && (
                      <div className="col-span-2">
                        <KVRow
                          icon={<AlignLeftIcon className="h-3 w-3" />}
                          label="Description"
                          value={
                            <span className="text-sm whitespace-pre-wrap">
                              {project.description}
                            </span>
                          }
                        />
                      </div>
                    )}
                  </div>
                </InfoCard>

                {/* Google Drive — col-span-1 */}
                <InfoCard
                  iconBg="bg-transparent"
                  iconText=""
                  icon={<GoogleDriveIcon className="h-4 w-4" />}
                  title="Google Drive"
                >
                  {project.drive_folder_url ? (
                    <div className="flex flex-col gap-3">
                      <p className="text-sm font-medium leading-snug">
                        {project.drive_folder_name ?? 'Project folder'}
                      </p>
                      <p className="text-xs text-muted-foreground">Google Drive folder</p>
                      <a
                        href={project.drive_folder_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline mt-auto"
                      >
                        Open in Drive <ExternalLinkIcon className="h-3 w-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground py-4 h-full">
                      <GoogleDriveIcon className="h-8 w-8 opacity-30" />
                      <p className="text-sm italic text-center">No folder linked yet</p>
                    </div>
                  )}
                </InfoCard>

                {/* Mini stat — Open Tasks */}
                <InfoCard
                  iconBg="bg-indigo-500/10"
                  iconText="text-indigo-600"
                  icon={<ListChecksIcon className="h-3.5 w-3.5" />}
                  title="Open Tasks"
                >
                  <p className="text-4xl font-bold leading-none">0</p>
                  <p className="text-xs text-muted-foreground mt-1.5">No tasks yet</p>
                </InfoCard>

                {/* Mini stat — Photos */}
                <InfoCard
                  iconBg="bg-pink-500/10"
                  iconText="text-pink-600"
                  icon={<ImageIcon className="h-3.5 w-3.5" />}
                  title="Photos"
                >
                  <p className="text-4xl font-bold leading-none">0</p>
                  <p className="text-xs text-muted-foreground mt-1.5">No photos yet</p>
                </InfoCard>

                {/* Mini stat — Documents */}
                <InfoCard
                  iconBg="bg-teal-500/10"
                  iconText="text-teal-600"
                  icon={<FileTextIcon className="h-3.5 w-3.5" />}
                  title="Documents"
                >
                  <p className="text-4xl font-bold leading-none">0</p>
                  <p className="text-xs text-muted-foreground mt-1.5">No documents yet</p>
                </InfoCard>

                {/* Notes — col-span-3 */}
                <InfoCard
                  className="col-span-3"
                  iconBg="bg-muted"
                  iconText="text-muted-foreground"
                  icon={<StickyNoteIcon className="h-3.5 w-3.5" />}
                  title="Notes"
                >
                  {project.notes ? (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{project.notes}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No notes added</p>
                  )}
                </InfoCard>

                {/* Insurance Claim — always visible */}
                <InfoCard
                  className={project.permit_required ? 'col-span-2' : 'col-span-3'}
                  iconBg={project.is_insurance_claim ? 'bg-orange-500/10' : 'bg-muted'}
                  iconText={project.is_insurance_claim ? 'text-orange-600' : 'text-muted-foreground'}
                  icon={<ShieldIcon className="h-3.5 w-3.5" />}
                  title="Insurance Claim"
                >
                  {project.is_insurance_claim ? (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <KVRow
                        icon={<HashIcon className="h-3 w-3" />}
                        label="Claim number"
                        value={project.claim_number ?? dash}
                      />
                      <KVRow
                        icon={<Building2Icon className="h-3 w-3" />}
                        label="Insurance company"
                        value={project.insurance_company ?? dash}
                      />
                      <KVRow
                        icon={<UserIcon className="h-3 w-3" />}
                        label="Adjuster name"
                        value={project.adjuster_name ?? dash}
                      />
                      <KVRow
                        icon={<PhoneIcon className="h-3 w-3" />}
                        label="Adjuster phone"
                        value={project.adjuster_phone ?? dash}
                      />
                      <KVRow
                        icon={<CalendarIcon className="h-3 w-3" />}
                        label="Date of loss"
                        value={
                          project.date_of_loss
                            ? formatDateWithAbbreviatedMonth(project.date_of_loss)
                            : dash
                        }
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Not an insurance claim</p>
                  )}
                </InfoCard>

                {/* Permit — always visible */}
                <InfoCard
                  className={project.is_insurance_claim ? 'col-span-1' : 'col-span-3'}
                  iconBg={project.permit_required ? 'bg-slate-500/10' : 'bg-muted'}
                  iconText={project.permit_required ? 'text-slate-600' : 'text-muted-foreground'}
                  icon={<FileCheckIcon className="h-3.5 w-3.5" />}
                  title="Permit"
                >
                  {project.permit_required ? (
                    <div className="flex flex-col gap-4">
                      <KVRow
                        icon={<HashIcon className="h-3 w-3" />}
                        label="Permit number"
                        value={project.permit_number ?? dash}
                      />
                      <KVRow
                        icon={<CalendarIcon className="h-3 w-3" />}
                        label="Issued date"
                        value={
                          project.permit_issued_date
                            ? formatDateWithAbbreviatedMonth(project.permit_issued_date)
                            : dash
                        }
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No permit required</p>
                  )}
                </InfoCard>

                {/* Recent Activity — col-span-3 */}
                <InfoCard
                  className="col-span-3"
                  iconBg="bg-primary/10"
                  iconText="text-primary"
                  icon={<ClockIcon className="h-3.5 w-3.5" />}
                  title="Recent Activity"
                >
                  <ActivityEntry title="Project created" timestamp={project.created_at} />
                </InfoCard>

              </div>
            </TabsContent>

            {/* ── Photos ─────────────────────────────────────── */}
            <TabsContent value="photos" className="mt-0 p-6">
              <div className="max-w-5xl mx-auto">
                <EmptyTab label="No photos uploaded yet" />
              </div>
            </TabsContent>

            {/* ── Documents ──────────────────────────────────── */}
            <TabsContent value="documents" className="mt-0 p-6">
              <div className="max-w-3xl mx-auto flex flex-col gap-6">

                {/* ── Invoices section ─── */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Invoices {linkedInvoices && linkedInvoices.length > 0 ? `(${linkedInvoices.length})` : ''}
                    </p>
                    <Popover open={invoicePickerOpen} onOpenChange={setInvoicePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                          <PlusIcon className="h-3 w-3" />
                          Link Invoice
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-72" align="end">
                        <Command>
                          <CommandInput placeholder="Search invoices..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No matching invoices found.</CommandEmpty>
                            {(allInvoices?.filter(
                              (inv) =>
                                (project.customer == null || inv.customer_id === project.customer) &&
                                (inv.project_id == null || inv.project_id === project.id)
                            ) ?? []).map((inv) => {
                              const alreadyLinked = inv.project_id === project.id;
                              return (
                                <CommandItem
                                  key={inv.invoice_number}
                                  value={`${inv.invoice_number}`}
                                  disabled={alreadyLinked}
                                  onSelect={() => {
                                    if (!alreadyLinked) {
                                      linkInvoice.mutate(inv.invoice_number);
                                      setInvoicePickerOpen(false);
                                    }
                                  }}
                                >
                                  <div className="flex items-center justify-between w-full gap-2">
                                    <span className="text-sm font-medium">
                                      INV-{formatNumber(inv.invoice_number)}
                                    </span>
                                    <span className="text-xs text-muted-foreground flex-1 truncate">
                                      {inv.invoice_status?.name}
                                    </span>
                                    <span className="text-xs font-semibold tabular-nums">
                                      ${formatMoneyValue(inv.total)}
                                    </span>
                                    {alreadyLinked && (
                                      <LinkIcon className="h-3 w-3 text-primary flex-shrink-0" />
                                    )}
                                  </div>
                                </CommandItem>
                              );
                            })}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-2">
                    {invoicesLoading && (
                      <div className="flex items-center gap-2 py-8 justify-center text-sm text-muted-foreground">
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                        Loading invoices...
                      </div>
                    )}
                    {!invoicesLoading && (!linkedInvoices || linkedInvoices.length === 0) && (
                      <div className="flex items-center justify-center py-8 border border-dashed border-border rounded-xl text-sm text-muted-foreground">
                        No invoices linked to this project
                      </div>
                    )}
                    {linkedInvoices?.map((inv) => {
                      const statusName = inv.invoice_status?.name ?? '';
                      const statusColor =
                        statusName === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200'
                          : statusName === 'Overdue'
                          ? 'bg-destructive/10 text-destructive border-destructive/20'
                          : 'bg-amber-500/10 text-amber-700 border-amber-200';
                      return (
                        <div
                          key={inv.invoice_number}
                          className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
                        >
                          <div className="h-9 w-9 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center flex-shrink-0">
                            <ReceiptIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold">
                                INV-{formatNumber(inv.invoice_number)}
                              </p>
                              <span
                                className={`inline-flex items-center px-1.5 py-0 text-[10px] font-semibold rounded border ${statusColor}`}
                              >
                                {statusName}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {inv.service?.name ?? inv.service_type?.name ?? ''}
                              {inv.issue_date &&
                                ` · ${new Date(inv.issue_date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  timeZone: 'UTC',
                                })}`}
                            </p>
                          </div>
                          <span className="text-sm font-bold tabular-nums flex-shrink-0">
                            ${formatMoneyValue(inv.total)}
                          </span>
                          <a
                            href={`/invoices/${inv.invoice_number}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline flex-shrink-0"
                          >
                            View <ExternalLinkIcon className="h-3 w-3" />
                          </a>
                          <button
                            title="Download PDF"
                            onClick={() => handleDownloadInvoice(inv.invoice_number)}
                            disabled={downloadingInvoiceId === inv.invoice_number}
                            className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground flex-shrink-0 transition-colors disabled:opacity-40"
                          >
                            {downloadingInvoiceId === inv.invoice_number
                              ? <Loader2Icon className="h-3 w-3 animate-spin" />
                              : <DownloadIcon className="h-3 w-3" />}
                          </button>
                          <button
                            title="Unlink invoice"
                            onClick={() => unlinkInvoice.mutate(inv.invoice_number)}
                            className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground flex-shrink-0 transition-colors"
                          >
                            <XIcon className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Quotes section ─── */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Quotes {linkedQuotes && linkedQuotes.length > 0 ? `(${linkedQuotes.length})` : ''}
                    </p>
                    <Popover open={quotePickerOpen} onOpenChange={setQuotePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                          <PlusIcon className="h-3 w-3" />
                          Link Quote
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-72" align="end">
                        <Command>
                          <CommandInput placeholder="Search quotes..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No matching quotes found.</CommandEmpty>
                            {(allQuotes?.filter(
                              (q) =>
                                (project.customer == null || q.customer_id === project.customer) &&
                                (q.project_id == null || q.project_id === project.id)
                            ) ?? []).map((q) => {
                              const alreadyLinked = q.project_id === project.id;
                              return (
                                <CommandItem
                                  key={q.quote_number}
                                  value={`${q.quote_number}`}
                                  disabled={alreadyLinked}
                                  onSelect={() => {
                                    if (!alreadyLinked) {
                                      linkQuote.mutate(q.quote_number);
                                      setQuotePickerOpen(false);
                                    }
                                  }}
                                >
                                  <div className="flex items-center justify-between w-full gap-2">
                                    <span className="text-sm font-medium">
                                      QT-{formatNumber(q.quote_number)}
                                    </span>
                                    <span className="text-xs text-muted-foreground flex-1 truncate">
                                      {q.status?.name}
                                    </span>
                                    <span className="text-xs font-semibold tabular-nums">
                                      ${formatMoneyValue(q.total)}
                                    </span>
                                    {alreadyLinked && (
                                      <LinkIcon className="h-3 w-3 text-primary flex-shrink-0" />
                                    )}
                                  </div>
                                </CommandItem>
                              );
                            })}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-2">
                    {quotesLoading && (
                      <div className="flex items-center gap-2 py-8 justify-center text-sm text-muted-foreground">
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                        Loading quotes...
                      </div>
                    )}
                    {!quotesLoading && (!linkedQuotes || linkedQuotes.length === 0) && (
                      <div className="flex items-center justify-center py-8 border border-dashed border-border rounded-xl text-sm text-muted-foreground">
                        No quotes linked to this project
                      </div>
                    )}
                    {linkedQuotes?.map((q) => {
                      const statusName = q.status?.name ?? '';
                      const statusColor =
                        statusName === 'Accepted'
                          ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200'
                          : statusName === 'Rejected'
                          ? 'bg-destructive/10 text-destructive border-destructive/20'
                          : 'bg-amber-500/10 text-amber-700 border-amber-200';
                      return (
                        <div
                          key={q.quote_number}
                          className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
                        >
                          <div className="h-9 w-9 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center flex-shrink-0">
                            <FileTextIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold">
                                QT-{formatNumber(q.quote_number)}
                              </p>
                              <span
                                className={`inline-flex items-center px-1.5 py-0 text-[10px] font-semibold rounded border ${statusColor}`}
                              >
                                {statusName}
                              </span>
                              {q.converted && (
                                <span className="inline-flex items-center px-1.5 py-0 text-[10px] font-semibold rounded border bg-muted text-muted-foreground border-border">
                                  Converted
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {q.service?.name ?? ''}
                              {q.issue_date &&
                                ` · ${new Date(q.issue_date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  timeZone: 'UTC',
                                })}`}
                            </p>
                          </div>
                          <span className="text-sm font-bold tabular-nums flex-shrink-0">
                            ${formatMoneyValue(q.total)}
                          </span>
                          <a
                            href={`/quotes/${q.quote_number}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline flex-shrink-0"
                          >
                            View <ExternalLinkIcon className="h-3 w-3" />
                          </a>
                          <button
                            title="Download PDF"
                            onClick={() => handleDownloadQuote(q.quote_number)}
                            disabled={downloadingQuoteId === q.quote_number}
                            className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground flex-shrink-0 transition-colors disabled:opacity-40"
                          >
                            {downloadingQuoteId === q.quote_number
                              ? <Loader2Icon className="h-3 w-3 animate-spin" />
                              : <DownloadIcon className="h-3 w-3" />}
                          </button>
                          <button
                            title="Unlink quote"
                            onClick={() => unlinkQuote.mutate(q.quote_number)}
                            className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground flex-shrink-0 transition-colors"
                          >
                            <XIcon className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Drive Files section ─── */}
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">
                    Drive Files
                  </p>
                  <div className="flex flex-col gap-2">
                    {!project.drive_folder_id && (
                      <EmptyTab label="No Drive folder linked to this project" />
                    )}
                    {project.drive_folder_id && !driveReady && !docsLoading && !needsDrivePermission && (
                      <EmptyTab label="Google Drive not connected — sign in with Google to view documents" />
                    )}
                    {needsDrivePermission && (
                      <div className="flex flex-col items-center justify-center gap-4 py-16 border border-dashed border-border rounded-xl px-6 text-center">
                        <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                          <GoogleDriveIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1">Google Drive access required</p>
                          <p className="text-xs text-muted-foreground max-w-xs">
                            Your current Google session doesn't include Drive permissions.
                            Re-connect with Google to grant read access to your Drive files.
                          </p>
                        </div>
                        <Button size="sm" onClick={() => googleLogin()}>
                          <ExternalLinkIcon className="h-4 w-4 mr-2" />
                          Re-connect with Google
                        </Button>
                      </div>
                    )}
                    {docsLoading && (
                      <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground text-sm">
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                        Loading Drive files...
                      </div>
                    )}
                    {docsError && !docsLoading && <EmptyTab label={docsError} />}
                    {docsFetched && !docsLoading && !docsError && docs.length === 0 && project.drive_folder_id && (
                      <EmptyTab label="No PDF or Word documents found in this project's Drive folder" />
                    )}
                    {docs.map((file) => {
                      const isPdf = file.mimeType === 'application/pdf';
                      return (
                        <div
                          key={file.id}
                          className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
                        >
                          <div
                            className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isPdf
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-primary/10 text-primary'
                            }`}
                          >
                            <FileTextIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {isPdf ? 'PDF' : 'Word document'}
                              {file.modifiedTime &&
                                ` · ${new Date(file.modifiedTime).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}`}
                            </p>
                          </div>
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline flex-shrink-0"
                            >
                              Open <ExternalLinkIcon className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </TabsContent>

            {/* ── Tasks ──────────────────────────────────────── */}
            <TabsContent value="tasks" className="mt-0 p-6">
              <div className="max-w-5xl mx-auto">
                <EmptyTab label="No open tasks" />
              </div>
            </TabsContent>

            {/* ── Activity ───────────────────────────────────── */}
            <TabsContent value="activity" className="mt-0 p-6">
              <div className="max-w-3xl mx-auto flex flex-col gap-3">
                <ActivityEntry title="Project created" timestamp={project.created_at} />
              </div>
            </TabsContent>

          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
