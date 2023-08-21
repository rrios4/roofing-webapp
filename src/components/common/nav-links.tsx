import { LayoutDashboardIcon, HomeIcon, HammerIcon, InboxIcon, SendIcon, ClipboardSignatureIcon, UsersIcon, PlusIcon, SettingsIcon } from 'lucide-react';
export const navLinks = [
    {
        title: 'Home',
        icon: <HomeIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300" />,
        path: '/',
        group: 1,
        lastOfGroup: true
      },
      {
        title: 'Inbox',
        icon: <InboxIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300" />,
        path: '/inbox',
        group: 2
      },
      {
        title: 'Jobs',
        icon: <HammerIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300" />,
        path: '/jobs',
        group: 2
      },
      {
        title: 'Invoices',
        icon: <SendIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300" />,
        path: '/invoices',
        group: 2
      },
      {
        title: 'Quotes',
        icon: <ClipboardSignatureIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300"/>,
        path: "/quotes",
        group: 2
      },
      {
        title: 'Customers',
        icon: <UsersIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300"/>,
        path: "/customers",
        group: 2,
        lastOfGroup: false,
      },
      // {
      //   title: "Settings",
      //   icon: <SettingsIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300"/>,
      //   path: "/settings",
      //   group: 3
      // }
]