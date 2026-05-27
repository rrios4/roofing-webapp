import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  KanbanSquareIcon,
  UserPlusIcon,
  FileTextIcon,
  Receipt,
  ChevronRightIcon,
  SunIcon,
  Loader2,
  FolderKanbanIcon
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import AddProjectForm from '../forms/add-project-form';
import { useAuth } from '../../hooks/useAuth';
import { useFetchProjects, useFetchProjectStatuses } from '../../hooks/useAPI/use-projects';
import { useRecentlyCreatedCustomers } from '../../hooks/useAPI/use-customer';

interface MobileHomeDashboardProps {
  onAddCustomer?: () => void;
  onAddQuote?: () => void;
  onAddInvoice?: () => void;
}

function stringHue(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

function statusColor(name: string): string {
  return `oklch(0.65 0.13 ${stringHue(name)})`;
}

function avatarBg(name: string): string {
  return `oklch(0.78 0.08 ${stringHue(name)})`;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFirstName(user: any): string {
  const full: string =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'there';
  return full.split(' ')[0];
}

const GLASS = 'bg-card border border-border rounded-3xl';

export function MobileHomeDashboard({
  onAddCustomer,
  onAddQuote,
  onAddInvoice
}: MobileHomeDashboardProps) {
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const { data: projects, isLoading: projectsLoading } = useFetchProjects();
  const { data: statuses } = useFetchProjectStatuses();
  const { data: recentCustomers, isLoading: customersLoading } = useRecentlyCreatedCustomers(4);

  const firstName = getFirstName(auth?.user);

  const pipelineData = useMemo(() => {
    if (!projects || !statuses) return [];
    return [...statuses]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((status) => ({
        ...status,
        count: projects.filter((p) => p.project_status_id === status.id).length,
        color: statusColor(status.name)
      }));
  }, [projects, statuses]);

  const total = projects?.length ?? 0;

  const quickActions = [
    {
      id: 'project',
      title: 'New project',
      sub: 'Start a job',
      tint: 'from-blue-500 to-blue-600',
      shadowColor: 'rgba(59,130,246,0.35)',
      icon: <KanbanSquareIcon className="w-5 h-5 text-white" strokeWidth={2} />,
      action: () => setAddProjectOpen(true)
    },
    {
      id: 'customer',
      title: 'Add customer',
      sub: 'To your contacts',
      tint: 'from-purple-600 to-violet-600',
      shadowColor: 'rgba(124,58,237,0.35)',
      icon: <UserPlusIcon className="w-5 h-5 text-white" strokeWidth={2} />,
      action: onAddCustomer
    },
    {
      id: 'quote',
      title: 'New quote',
      sub: 'Build an estimate',
      tint: 'from-orange-500 to-amber-500',
      shadowColor: 'rgba(249,115,22,0.35)',
      icon: <FileTextIcon className="w-5 h-5 text-white" strokeWidth={2} />,
      action: onAddQuote
    },
    {
      id: 'invoice',
      title: 'New invoice',
      sub: 'Bill a customer',
      tint: 'from-emerald-500 to-green-600',
      shadowColor: 'rgba(16,185,129,0.35)',
      icon: <Receipt className="w-5 h-5 text-white" strokeWidth={2} />,
      action: onAddInvoice
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="flex flex-col gap-5 pt-4 pb-28">
          {/* ── Greeting Header ── */}
          <header className="flex items-start justify-between gap-3 pt-1">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground mb-1">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <h1 className="text-2xl font-bold tracking-tight leading-tight">
                {getGreeting()}, <span className="capitalize">{firstName}</span>{' '}
                <span role="img" aria-label="wave">
                  👋
                </span>
              </h1>
            </div>
            {/* Weather stub widget */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-white/10 shadow-md shadow-black/10 flex-shrink-0">
              <SunIcon className="w-6 h-6 text-amber-400" strokeWidth={1.8} />
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold">78°</span>
                <span className="text-[10px] text-muted-foreground">Houston</span>
              </div>
            </div>
          </header>

          {/* ── Pipeline Summary ── */}
          <section className={`${GLASS} p-5 flex flex-col gap-4`}>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold tracking-tight leading-none">
                  {projectsLoading ? '—' : total}
                </div>
                <div className="text-xs text-muted-foreground mt-1.5">active projects</div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                ✓ Pipeline
              </span>
            </div>

            {/* Stacked progress bar */}
            {!projectsLoading && pipelineData.length > 0 && total > 0 && (
              <div className="flex h-2.5 rounded-full overflow-hidden bg-muted">
                {pipelineData
                  .filter((s) => s.count > 0)
                  .map((s) => (
                    <div
                      key={s.id}
                      style={{
                        width: `${(s.count / total) * 100}%`,
                        background: s.color
                      }}
                    />
                  ))}
              </div>
            )}

            {/* Status grid */}
            {projectsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {pipelineData.slice(0, 6).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => navigate('/projects')}
                    className="flex flex-col items-start gap-1 p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-xl font-bold leading-none">{s.count}</span>
                    <span className="text-[10px] leading-tight text-muted-foreground line-clamp-2">
                      {s.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate('/projects')}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/15 active:bg-primary/20 transition-colors">
              View pipeline <ChevronRightIcon className="w-3.5 h-3.5" />
            </button>
          </section>

          {/* ── Quick Actions ── */}
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">
              Quick actions
            </p>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`relative ${GLASS} p-4 flex flex-col gap-3 text-left active:scale-[0.97] transition-transform`}>
                  <div
                    className={`w-11 h-11 rounded-[14px] flex items-center justify-center bg-gradient-to-br ${item.tint}`}
                    style={{ boxShadow: `0 6px 14px ${item.shadowColor}` }}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold leading-tight">{item.title}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</div>
                  </div>
                  <ChevronRightIcon className="absolute top-4 right-4 w-3.5 h-3.5 text-muted-foreground/40" />
                </button>
              ))}
            </div>
          </section>

          {/* ── Recent Customers ── */}
          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Recent customers
              </p>
              <button
                onClick={() => navigate('/customers')}
                className="text-xs font-medium text-primary flex items-center gap-0.5 hover:underline">
                See all <ChevronRightIcon className="w-3 h-3" />
              </button>
            </div>

            {customersLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : !recentCustomers || recentCustomers.length === 0 ? (
              <div className={`${GLASS} p-6 text-center text-sm text-muted-foreground`}>
                No customers yet
              </div>
            ) : (
              <div
                className={`${GLASS} overflow-hidden divide-y divide-white/20 dark:divide-white/5`}>
                {recentCustomers.map((customer) => {
                  const fullName = `${customer.first_name} ${customer.last_name}`;
                  const abbr =
                    `${customer.first_name?.[0] ?? ''}${customer.last_name?.[0] ?? ''}`.toUpperCase();
                  const bg = avatarBg(fullName);
                  return (
                    <button
                      key={customer.id}
                      onClick={() => navigate('/customers')}
                      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: bg, color: '#1a1a1d' }}>
                        {abbr}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{fullName}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {customer.city ? `${customer.city}, ${customer.state}` : customer.email}
                        </div>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Add Project Dialog */}
      <Dialog open={addProjectOpen} onOpenChange={setAddProjectOpen}>
        <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg border bg-muted">
                <FolderKanbanIcon size={18} className="text-muted-foreground" />
              </div>
              <div>
                <DialogTitle className="text-base">Add project</DialogTitle>
                <DialogDescription className="text-xs">
                  Create a new project — start with the job site address.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <ScrollArea className="flex-1 overflow-y-auto px-6 pb-6">
            <AddProjectForm setOpen={setAddProjectOpen} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MobileHomeDashboard;
