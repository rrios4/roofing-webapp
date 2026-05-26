import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { FilterIcon } from 'lucide-react';
import { ProjectStatus, ProjectType } from '../../types/db_types';
import { cn } from '../../lib/utils';

export type ProjectFilters = {
  statusIds: number[];
  typeIds: number[];
};

type Props = {
  statuses: ProjectStatus[];
  types: ProjectType[];
  filters: ProjectFilters;
  setFilters: (f: ProjectFilters) => void;
};

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

export default function ProjectFilterPopover({ statuses, types, filters, setFilters }: Props) {
  const filterCount = filters.statusIds.length + filters.typeIds.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative gap-1.5">
          <FilterIcon className="h-3.5 w-3.5" />
          Filter
          {filterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">Filters</p>
          <button
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setFilters({ statusIds: [], typeIds: [] })}
          >
            Clear all
          </button>
        </div>

        {statuses.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground mb-2">Status</p>
            <div className="flex flex-wrap gap-1.5">
              {statuses.map((s) => {
                const active = filters.statusIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                    )}
                    onClick={() => setFilters({ ...filters, statusIds: toggle(filters.statusIds, s.id) })}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {types.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground mb-2">Type</p>
            <div className="flex flex-wrap gap-1.5">
              {types.map((t) => {
                const active = filters.typeIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                    )}
                    onClick={() => setFilters({ ...filters, typeIds: toggle(filters.typeIds, t.id) })}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
