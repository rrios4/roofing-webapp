import React from 'react';
import { SelectContent, SelectItem } from './ui/select';

// Generic interface for any selectable item - completely flexible
interface SelectableItem {
  [key: string]: any; // Allow any object structure
}

type Props<T extends SelectableItem = SelectableItem> = {
  data?: T[];
  valueKey?: keyof T; // Which property to use as the value
  labelKey?: keyof T; // Which property to use as the label
  emptyMessage?: string; // Custom empty message
  disabled?: boolean; // Option to disable all items
};

export default function DefaultSelectDataItems<T extends SelectableItem>({
  data,
  valueKey = 'id',
  labelKey = 'name',
  emptyMessage = 'No items available ❌',
  disabled = false
}: Props<T>) {
  return (
    <SelectContent>
      {data && data.length > 0 ? (
        data.map((item, index) => {
          const value = item[valueKey];
          const label = item[labelKey];

          // Ensure we never pass an empty string as value
          const itemValue =
            value !== null && value !== undefined && value !== ''
              ? String(value)
              : `fallback_${index}`;

          return (
            <React.Fragment key={`${index}_${itemValue}`}>
              <SelectItem value={itemValue} className="hover:cursor-pointer" disabled={disabled}>
                {String(label || '')}
              </SelectItem>
            </React.Fragment>
          );
        })
      ) : (
        <SelectItem value="no_items_available" disabled>
          {emptyMessage}
        </SelectItem>
      )}
    </SelectContent>
  );
}
