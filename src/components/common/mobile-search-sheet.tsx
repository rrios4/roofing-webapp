import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '../ui/sheet';
import { SearchCommandContent } from './command-palette';

interface MobileSearchSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileSearchSheet: React.FC<MobileSearchSheetProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value);
    if (!value) setQuery('');
  };

  const handleSelect = (path: string) => {
    navigate(path);
    handleOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-[2rem] p-0 h-[90svh] flex flex-col"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        {/* a11y */}
        <SheetTitle className="sr-only">Search</SheetTitle>
        <SheetDescription className="sr-only">
          Search for customers or navigate to a page.
        </SheetDescription>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted" />
        </div>

        {/* Command content — fills remaining height */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <SearchCommandContent
            query={query}
            onQueryChange={setQuery}
            onSelect={handleSelect}
            inputClassName="h-14 text-base"
            placeholder="Search customers, pages..."
            commandClassName="h-full [&_[cmdk-list]]:max-h-none [&_[cmdk-list]]:flex-1 [&_[cmdk-list]]:overflow-y-auto"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSearchSheet;
