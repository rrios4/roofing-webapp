import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { HomeIcon, SpeechIcon, SendIcon, ClipboardSignatureIcon, UsersIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';

interface MobileBottomNavProps {
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  activeIcon: LucideIcon;
  notificationKey?: keyof ReturnType<typeof useNotifications>['notifications'];
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: HomeIcon,
    activeIcon: HomeIcon // Can be different for filled vs outline
  },
  {
    id: 'leads',
    label: 'Leads',
    path: '/inbox',
    icon: SpeechIcon,
    activeIcon: SpeechIcon,
    notificationKey: 'leads'
  },
  {
    id: 'invoices',
    label: 'Invoices',
    path: '/invoices',
    icon: SendIcon,
    activeIcon: SendIcon,
    notificationKey: 'invoices'
  },
  {
    id: 'quotes',
    label: 'Quotes',
    path: '/quotes',
    icon: ClipboardSignatureIcon,
    activeIcon: ClipboardSignatureIcon,
    notificationKey: 'quotes'
  },
  {
    id: 'customers',
    label: 'Customers',
    path: '/customers',
    icon: UsersIcon,
    activeIcon: UsersIcon,
    notificationKey: 'customers'
  }
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ className = '' }) => {
  const location = useLocation();
  const { notifications } = useNotifications();
  const auth = useAuth();

  // Only render if user is authenticated
  if (!auth?.user) {
    return null;
  }

  // Determine if a nav item is active
  const isActiveItem = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 lg:hidden ${className}`}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)' // iOS safe area
      }}>
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = isActiveItem(item.path);
          const IconComponent = isActive ? item.activeIcon : item.icon;
          const badgeCount = item.notificationKey ? notifications[item.notificationKey] : null;

          return (
            <Link
              key={item.id}
              to={item.path}
              className="flex flex-col items-center justify-center min-w-0 flex-1 p-2 relative"
              style={{
                // Ensure thumb-friendly tap area (44px minimum)
                minHeight: '44px',
                minWidth: '44px'
              }}>
              {/* Icon with Badge Container */}
              <div className="flex items-center justify-center mb-1 relative">
                <IconComponent
                  size={18}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2} // Slightly bolder for active state
                />

                {/* Notification Badge */}
                {badgeCount != null && badgeCount > 0 && (
                  <div className="absolute -top-2 -right-2">
                    <Badge
                      variant="destructive"
                      className="h-4 w-4 p-0 flex items-center justify-center text-[10px] font-medium rounded-full border border-white dark:border-zinc-900">
                      {badgeCount > 9 ? '9+' : badgeCount}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-medium transition-colors duration-200 truncate max-w-full ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                {item.label}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
