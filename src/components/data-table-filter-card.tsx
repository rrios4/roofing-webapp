import React from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type Props = {
  rootTable?: any;
  entity?: string;
  columnEntity: string;
  firstSelectName: string;
  secondSelectName: string;
  thirdSelectName: string;
};

export default function DataTableFilterCard({
  rootTable,
  entity,
  columnEntity,
  firstSelectName,
  secondSelectName,
  thirdSelectName
}: Props) {
  return (
    <>
      <div className="w-full">
        <div className="flex w-full shadow-sm gap-3 sm:gap-4 border px-3 sm:px-4 py-3 sm:py-4 rounded-lg flex-col bg-slate-50 dark:bg-zinc-800/50">
          <div className="w-full">
            <p className="mb-2 text-muted-foreground text-xs sm:text-sm font-medium">
              Search for {entity}
            </p>
            <Input
              className="bg-white dark:bg-zinc-900 text-xs sm:text-sm h-8 sm:h-9"
              name={`search_${entity}`}
              type="search"
              placeholder={`Enter ${entity} information...`}
              onChange={(event) =>
                rootTable?.getColumn(columnEntity)?.setFilterValue(event.target.value)
              }
              value={rootTable?.getColumn(columnEntity)?.getFilterValue() ?? ''}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
            <div className="text-xs sm:text-sm">
              <p className="mb-2 text-muted-foreground text-xs sm:text-sm font-medium">
                {firstSelectName}
              </p>
              <Select>
                <SelectTrigger className="bg-white dark:bg-zinc-900 text-xs sm:text-sm h-8 sm:h-9">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs sm:text-sm">
                    All
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs sm:text-sm">
              <p className="mb-2 text-muted-foreground text-xs sm:text-sm font-medium">
                {secondSelectName}
              </p>
              <Select>
                <SelectTrigger className="bg-white dark:bg-zinc-900 text-xs sm:text-sm h-8 sm:h-9">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs sm:text-sm">
                    All
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs sm:text-sm">
              <p className="mb-2 text-muted-foreground text-xs sm:text-sm font-medium">
                {thirdSelectName}
              </p>
              <Select>
                <SelectTrigger className="bg-white dark:bg-zinc-900 text-xs sm:text-sm h-8 sm:h-9">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs sm:text-sm">
                    All
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
