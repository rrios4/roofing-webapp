import React, { useRef, useState } from 'react';
import { MapPinIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { Popover, PopoverAnchor, PopoverContent } from '../ui/popover';
import { useAddressAutocomplete, type AddressParts } from '../../hooks/useAddressAutocomplete';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (parts: AddressParts) => void;
  className?: string;
  placeholder?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  className,
  placeholder = 'Start typing an address...'
}: AddressAutocompleteProps) {
  const { predictions, detailsLoading, fetchPredictions, fetchPlaceDetails, clearPredictions } =
    useAddressAutocomplete();
  const [open, setOpen] = useState(false);
  // Track whether a mousedown on a suggestion is in progress so blur doesn't close
  // the popover before the click fires
  const isSelectingRef = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    fetchPredictions(val);
    setOpen(val.length >= 3);
  };

  const handleSelect = async (placeId: string, mainText: string) => {
    isSelectingRef.current = true;
    // Optimistically show the street text while details load
    onChange(mainText);
    setOpen(false);
    clearPredictions();

    const parts = await fetchPlaceDetails(placeId);
    if (parts) {
      onChange(parts.street_address || mainText);
      onAddressSelect(parts);
    }
    isSelectingRef.current = false;
  };

  const handleBlur = () => {
    // Delay so that mousedown on a suggestion can fire before we close
    setTimeout(() => {
      if (!isSelectingRef.current) setOpen(false);
    }, 150);
  };

  return (
    <Popover open={open && predictions.length > 0} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Input
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={className}
          autoComplete="off"
        />
      </PopoverAnchor>

      <PopoverContent
        className="p-1 w-[var(--radix-popover-trigger-width)]"
        onOpenAutoFocus={(e) => e.preventDefault()}
        align="start"
        sideOffset={6}>
        <ul role="listbox" aria-label="Address suggestions" className="flex flex-col gap-0.5">
          {predictions.map((p) => (
            <li key={p.placeId} role="option">
              <button
                type="button"
                onMouseDown={() => handleSelect(p.placeId, p.mainText)}
                className="w-full flex items-start gap-2 px-3 py-2 rounded-md text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                <MapPinIcon size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
                <span>
                  <span className="font-medium">{p.mainText}</span>
                  <span className="text-muted-foreground ml-1 text-xs">{p.secondaryText}</span>
                </span>
              </button>
            </li>
          ))}
          {detailsLoading && (
            <li className="px-3 py-2 text-sm text-muted-foreground">Loading address...</li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
