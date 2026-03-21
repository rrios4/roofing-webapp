import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { Badge } from '../ui/badge';
import { HomeIcon, SendIcon, ClipboardSignatureIcon, UsersIcon, SearchIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';
import { MobileSearchSheet } from './mobile-search-sheet';

interface MobileBottomNavProps {
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  notificationKey?: keyof ReturnType<typeof useNotifications>['notifications'];
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', path: '/', icon: HomeIcon },
  // { id: 'leads', label: 'Leads', path: '/inbox', icon: SpeechIcon, notificationKey: 'leads' },
  {
    id: 'invoices',
    label: 'Invoices',
    path: '/invoices',
    icon: SendIcon,
    notificationKey: 'invoices'
  },
  {
    id: 'quotes',
    label: 'Quotes',
    path: '/quotes',
    icon: ClipboardSignatureIcon,
    notificationKey: 'quotes'
  },
  {
    id: 'customers',
    label: 'Customers',
    path: '/customers',
    icon: UsersIcon,
    notificationKey: 'customers'
  }
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const auth = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  if (!auth?.user) return null;

  const activeTab = (() => {
    for (const item of [...navItems].reverse()) {
      if (item.path === '/') {
        if (location.pathname === '/') return item.id;
      } else if (location.pathname.startsWith(item.path)) {
        return item.id;
      }
    }
    return 'home';
  })();

  return (
    <div
      className={`fixed z-50 lg:hidden ${className}`}
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)',
        left: 'calc(env(safe-area-inset-left, 0px) + 6px)',
        right: 'calc(env(safe-area-inset-right, 0px) + 6px)'
      }}>
      {/* Mobile search bottom sheet */}
      <MobileSearchSheet open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Glass pill container */}
      <div className="relative flex items-center backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-white/10 rounded-[2rem] shadow-xl shadow-black/15 px-2 py-2 motion-safe:transition-all motion-safe:duration-300">
        <TabsPrimitive.Root
          value={activeTab}
          onValueChange={(val) => {
            const item = navItems.find((n) => n.id === val);
            if (item) navigate(item.path);
          }}
          className="flex-1">
          <TabsPrimitive.List className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              const badgeCount = item.notificationKey ? notifications[item.notificationKey] : null;

              return (
                <TabsPrimitive.Trigger
                  key={item.id}
                  value={item.id}
                  className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 rounded-[1.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-safe:transition-all motion-safe:duration-200">
                  {/* Icon + badge wrapper */}
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`flex items-center justify-center rounded-full px-3 py-1 motion-safe:transition-all motion-safe:duration-200 ${isActive ? 'bg-white/80 dark:bg-slate-800/80 shadow-sm' : 'bg-transparent'}`}>
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.5 : 1.8}
                        className={`motion-safe:transition-all motion-safe:duration-200 ${isActive ? 'text-primary scale-105' : 'text-muted-foreground'}`}
                      />
                    </div>
                    {badgeCount != null && badgeCount > 0 && (
                      <div className="absolute -top-1.5 -right-1">
                        <Badge
                          variant="destructive"
                          className="h-4 w-4 p-0 flex items-center justify-center text-[9px] font-semibold rounded-full border border-background shadow-sm">
                          {badgeCount > 99 ? '99+' : badgeCount}
                        </Badge>
                      </div>
                    )}
                  </div>
                  {/* Label */}
                  <span
                    className={`text-[9px] leading-none motion-safe:transition-all motion-safe:duration-200 ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground font-medium'}`}>
                    {item.label}
                  </span>
                </TabsPrimitive.Trigger>
              );
            })}
          </TabsPrimitive.List>
        </TabsPrimitive.Root>

        {/* Search icon button */}
        <button
          onClick={() => setSearchOpen(true)}
          aria-label="Open search"
          className="ml-1 shrink-0 flex items-center justify-center size-9 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-sm text-muted-foreground hover:text-foreground motion-safe:transition-all motion-safe:duration-200 hover:scale-105 active:scale-95">
          <SearchIcon size={16} />
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
