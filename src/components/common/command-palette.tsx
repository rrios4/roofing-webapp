import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Receipt,
  Inbox,
  User,
  Settings,
  Database
} from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '../ui/command';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { useSearchCustomers, useRecentlyCreatedCustomers } from '../../hooks/useAPI/use-customer';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const PAGES = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Customers', path: '/customers', icon: Users },
  { label: 'Jobs', path: '/jobs', icon: Briefcase },
  { label: 'Quotes', path: '/quotes', icon: FileText },
  { label: 'Invoices', path: '/invoices', icon: Receipt },
  { label: 'Inbox', path: '/inbox', icon: Inbox },
  { label: 'Profile', path: '/profile', icon: User },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Data Management', path: '/data-management', icon: Database }
];

const MAX_SEARCH_CUSTOMERS = 8;
const RECENT_CUSTOMERS_LIMIT = 3;

// ─── Shared search content ────────────────────────────────────────────────────
// Used by both CommandPalette (desktop Dialog) and MobileSearchSheet (bottom Sheet).

interface SearchCommandContentProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (path: string) => void;
  inputClassName?: string;
  placeholder?: string;
  commandClassName?: string;
}

export const SearchCommandContent: React.FC<SearchCommandContentProps> = ({
  query,
  onQueryChange,
  onSelect,
  inputClassName,
  placeholder = 'Search customers or navigate...',
  commandClassName
}) => {
  const debouncedQuery = useDebounce(query, 300);
  const isSearching = query.trim() !== '';
  const { data: searchResults, isLoading: isSearchLoading } = useSearchCustomers(debouncedQuery);
  const { data: recentCustomers, isLoading: isRecentLoading } =
    useRecentlyCreatedCustomers(RECENT_CUSTOMERS_LIMIT);

  const filteredPages =
    query.trim() === ''
      ? PAGES
      : PAGES.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()));

  const isLoading = isSearching ? isSearchLoading : isRecentLoading;
  const displayedCustomers = isSearching
    ? (searchResults?.slice(0, MAX_SEARCH_CUSTOMERS) ?? [])
    : (recentCustomers ?? []);

  return (
    <Command
      shouldFilter={false}
      className={`[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5${commandClassName ? ` ${commandClassName}` : ''}`}>
      <CommandInput
        placeholder={placeholder}
        value={query}
        onValueChange={onQueryChange}
        className={inputClassName}
      />
      <CommandList>
        <CommandEmpty>{isLoading ? 'Searching...' : 'No results found.'}</CommandEmpty>

        {displayedCustomers.length > 0 && (
          <CommandGroup heading={isSearching ? 'Customers' : 'Recently Updated'}>
            {displayedCustomers.map((customer) => (
              <CommandItem
                key={customer.id}
                value={String(customer.id)}
                onSelect={() => onSelect(`/customers/${customer.id}`)}>
                <User />
                <span>
                  {customer.first_name} {customer.last_name}
                </span>
                {customer.email && (
                  <span className="ml-auto text-xs text-muted-foreground truncate max-w-[200px]">
                    {customer.email}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {displayedCustomers.length > 0 && filteredPages.length > 0 && <CommandSeparator />}

        {filteredPages.length > 0 && (
          <CommandGroup heading="Pages">
            {filteredPages.map((page) => (
              <CommandItem key={page.path} value={page.path} onSelect={() => onSelect(page.path)}>
                <page.icon />
                <span>{page.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
};

// ─── Desktop command palette (Cmd+K) ─────────────────────────────────────────

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) setQuery('');
  };

  const handleSelect = (path: string) => {
    navigate(path);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <DialogDescription className="sr-only">
          Search for customers or navigate to a page.
        </DialogDescription>
        <SearchCommandContent query={query} onQueryChange={setQuery} onSelect={handleSelect} />
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
