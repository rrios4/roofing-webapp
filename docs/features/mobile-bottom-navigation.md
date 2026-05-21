# Mobile Bottom Navigation

A professional mobile bottom navigation component designed specifically for your roofing webapp, following UX/UI best practices from industry experts.

## 🎯 Features

Based on top UX/UI design principles, this mobile bottom navigation includes:

### ✅ **UX Best Practices Implemented:**
- **Limited to 5 tabs** for optimal user experience
- **Thumb-friendly tap areas** (44px minimum) for easy navigation
- **Clear active/inactive states** with color and font weight changes
- **Simple and familiar icons** that users instantly recognize
- **Short navigation labels** (one word each) for clean design
- **Clean and simple design** without unnecessary visual clutter
- **Consistent icon style** throughout the navigation
- **Limited color palette** using your brand blue color scheme
- **Notification badges** with red circles for important updates
- **Proper separation** from main content with top border

### 📱 **Mobile-First Design:**
- **Hidden on desktop** (`lg:hidden`) - only shows on mobile
- **iOS safe area support** for modern smartphones
- **Responsive sizing** and proper spacing for thumb navigation
- **Fixed bottom positioning** for consistent access
- **Dark mode support** for better user experience

## 🚀 Usage

The component is already integrated into your Layout component and will automatically appear on mobile devices.

### Navigation Structure

```typescript
const navItems = [
  { id: 'home', label: 'Home', path: '/', icon: HomeIcon },
  { id: 'leads', label: 'Leads', path: '/inbox', icon: SpeechIcon },
  { id: 'invoices', label: 'Invoices', path: '/invoices', icon: SendIcon },
  { id: 'quotes', label: 'Quotes', path: '/quotes', icon: ClipboardSignatureIcon },
  { id: 'customers', label: 'Customers', path: '/customers', icon: UsersIcon }
];
```

### Active State Detection

The component automatically detects the active route based on the current URL path:
- Home tab: Active only when on exact `/` path
- Other tabs: Active when the path starts with the tab's path (e.g., `/invoices`, `/invoices/123`)

## 🔔 Notification System

### Using Notifications

The mobile bottom nav includes a notification system using the `useNotifications` hook:

```typescript
import { useNotifications } from '../hooks/useNotifications';

const { notifications, updateNotificationCount } = useNotifications();

// Update notification count for leads
updateNotificationCount('leads', 5); // Shows "5" badge on Leads tab
```

### Notification Badge Behavior

- **Shows red badge** with white border for visibility
- **Displays count up to 9**, then shows "9+" for larger numbers
- **Auto-hides** when count is 0 or null
- **Positioned** in top-right corner of the icon

### Customizing Notifications

To connect to your backend data:

1. **Update the `useNotifications` hook** in `/src/hooks/useNotifications.tsx`
2. **Replace mock data** with actual API calls to your Supabase backend
3. **Add real-time subscriptions** for live notification updates

Example integration with your existing hooks:

```typescript
// In useNotifications.tsx
const { data: pendingInvoices } = useFetchPendingInvoices();
const { data: newLeads } = useFetchNewLeads();

useEffect(() => {
  setNotifications({
    invoices: pendingInvoices?.length || 0,
    leads: newLeads?.length || 0,
    quotes: 0,
    customers: 0
  });
}, [pendingInvoices, newLeads]);
```

## 🎨 Customization

### Colors

The component uses your brand colors:
- **Active state**: Blue 600 (`text-blue-600 dark:text-blue-400`)
- **Inactive state**: Gray 500 (`text-gray-500 dark:text-gray-400`)
- **Background**: White/Zinc 900 for dark mode
- **Badge**: Red (`variant="destructive"`)

### Icons

To change icons, update the `navItems` array:

```typescript
// Use different Lucide React icons
import { NewIcon } from 'lucide-react';

const navItems = [
  {
    id: 'home',
    icon: NewIcon,
    activeIcon: NewIcon, // Can be different for filled vs outline
    // ...
  }
];
```

### Adding New Tabs

To add a new tab (remember: max 5 tabs recommended):

```typescript
{
  id: 'settings',
  label: 'Settings',
  path: '/settings',
  icon: SettingsIcon,
  activeIcon: SettingsIcon,
  notificationKey: 'settings' // Optional for notifications
}
```

## 📱 Responsive Behavior

- **Mobile (< 1024px)**: Shows bottom navigation
- **Desktop (≥ 1024px)**: Hidden, desktop sidebar navigation is used
- **Content padding**: Added `pb-16 lg:pb-2` to main content area for mobile spacing

## 🛠 Technical Implementation

### Layout Integration

The component is integrated in `Layout.tsx`:

```typescript
<div className="pb-16 lg:pb-2"> {/* Added mobile padding */}
  {children}
</div>
<MobileBottomNav />
```

### Route Detection

Uses React Router's `useLocation` hook for active state detection:

```typescript
const isActiveItem = (path: string) => {
  if (path === '/') {
    return location.pathname === '/';
  }
  return location.pathname.startsWith(path);
};
```

## 🔧 Maintenance

### Adding Notification Support to New Pages

1. Import and use the notification hook in your page components
2. Update counts based on your data
3. Clear notifications when user visits the page

### Performance Considerations

- Component only renders on mobile (hidden on desktop)
- Uses CSS transitions for smooth animations
- Minimal re-renders with React hooks optimization

## 📏 Design Specifications

Following professional UX guidelines:

- **Height**: 64px (16 in Tailwind)
- **Icon size**: 24px for optimal visibility
- **Tap area**: 44px minimum for accessibility
- **Font size**: 12px for labels (text-xs)
- **Badge size**: 20px (5 in Tailwind) with centered text
- **Bottom padding**: Supports iOS safe area with `env(safe-area-inset-bottom)`

This mobile bottom navigation provides a professional, accessible, and user-friendly navigation experience specifically designed for your roofing webapp's mobile users!