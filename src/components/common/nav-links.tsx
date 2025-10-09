import {
  LayoutDashboardIcon,
  HomeIcon,
  HammerIcon,
  InboxIcon,
  SendIcon,
  ClipboardSignatureIcon,
  UsersIcon,
  PlusIcon,
  SettingsIcon,
  KanbanSquareIcon,
  ServerCogIcon,
  UserIcon,
  SpeechIcon
} from 'lucide-react';
import { title } from 'process';
export const navLinks = [
  {
    title: 'Home',
    icon: <HomeIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300" />,
    path: '/',
    group: 1,
    lastOfGroup: true
  },
  // {
  //   title: 'Projects',
  //   icon: <KanbanSquareIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300" />,
  //   path: '/projects',
  //   group: 1,
  //   lastOfGroup: true
  // },
  {
    title: 'Sales Leads',
    icon: <SpeechIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300" />,
    path: '/inbox',
    group: 2
  },
  // {
  //   title: 'Jobs',
  //   icon: <HammerIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300" />,
  //   path: '/jobs',
  //   group: 2
  // },
  {
    title: 'Invoices',
    icon: <SendIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300" />,
    path: '/invoices',
    group: 2
  },
  {
    title: 'Quotes',
    icon: <ClipboardSignatureIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300" />,
    path: '/quotes',
    group: 2
  },
  {
    title: 'Customers',
    icon: <UsersIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300" />,
    path: '/customers',
    group: 2,
    lastOfGroup: false
  },
  {
    title: 'Data Management',
    icon: <ServerCogIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300" />,
    path: '/data-management',
    group: 3
  }
  // {
  //   title: "Profile",
  //   icon: <UserIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300"/>,
  //   path: "/profile",
  //   group: 3,
  //   lastOfGroup: true
  // }
  // {
  //   title: "Settings",
  //   icon: <SettingsIcon size={'20px'} className="text-zinc-900 dark:text-zinc-300"/>,
  //   path: "/settings",
  //   group: 3
  // }
];
