import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Badge } from '../ui/badge';
import {
  HomeIcon,
  SpeechIcon,
  SendIcon,
  ClipboardSignatureIcon,
  UsersIcon,
  SettingsIcon
} from 'lucide-react';
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
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/data-management',
    icon: SettingsIcon,
    activeIcon: SettingsIcon
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
    <>
      <style>{`
        /* iOS Safe Area Support */
        @supports (padding: max(0px)) {
          .mobile-nav-ios {
            padding-bottom: max(env(safe-area-inset-bottom), 20px) !important;
            padding-left: env(safe-area-inset-left) !important;
            padding-right: env(safe-area-inset-right) !important;
          }
        }
        
        /* iOS Frosted Glass Effect */
        .mobile-nav-ios {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background-color: rgba(255, 255, 255, 0.85);
        }
        
        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          .mobile-nav-ios {
            background-color: rgba(39, 39, 42, 0.85) !important;
          }
        }
        
        /* Enhanced tap targets for iOS */
        .nav-item-ios {
          min-height: 48px;
          min-width: 48px;
          padding: 8px;
        }
      `}</style>
      <nav
        className={`mobile-nav-ios fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 dark:border-zinc-700 lg:hidden ${className}`}
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom), 20px)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)'
        }}>
        <div className="flex justify-around items-center px-2 pt-2">
          {navItems.map((item) => {
            const isActive = isActiveItem(item.path);
            const IconComponent = isActive ? item.activeIcon : item.icon;
            const badgeCount = item.notificationKey ? notifications[item.notificationKey] : null;

            return (
              <Link
                key={item.id}
                to={item.path}
                className="nav-item-ios flex flex-col items-center justify-center min-w-0 flex-1 relative transition-all duration-200 rounded-lg">
                {/* Icon with Badge Container */}
                <div className="flex items-center justify-center mb-1 relative">
                  <IconComponent
                    size={20}
                    className={`transition-all duration-200 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 scale-105'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  {/* Notification Badge - Following iOS Badge Guidelines */}
                  {badgeCount != null && badgeCount > 0 && (
                    <div className="absolute -top-2 -right-2">
                      <Badge
                        variant="destructive"
                        className="h-5 w-5 p-0 flex items-center justify-center text-[10px] font-semibold rounded-full border-2 border-white dark:border-zinc-900 shadow-sm">
                        {badgeCount > 99 ? '99+' : badgeCount}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[9px] font-medium transition-all duration-200 truncate max-w-full ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                  {item.label}
                </span>

                {/* Active Indicator - iOS Style */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full opacity-75" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
