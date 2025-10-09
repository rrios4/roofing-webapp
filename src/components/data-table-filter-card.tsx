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
        <div className="flex w-full shadow-xs gap-4 border px-[1rem] py-6 rounded-lg flex-col md:flex-row bg-slate-100 dark:bg-zinc-800">
          <div className="w-full md:w-[40%]">
            <p className="mb-1 text-muted-foreground text-[14px]">Search for {entity}</p>
            <Input
              className={'bg-white dark:bg-zinc-900'}
              name={`search_${entity}`}
              type="search"
              placeholder={`Enter ${entity} information here...`}
              onChange={(event) =>
                rootTable?.getColumn(columnEntity)?.setFilterValue(event.target.value)
              }
              value={rootTable?.getColumn(columnEntity)?.getFilterValue() ?? ''}
            />
          </div>
          <div className="grid grid-flow-row grid-cols-1 gap-4 w-full md:w-[60%] md:grid-cols-3">
            <div className="text-[14px] font-[500]">
              <p className="mb-1 text-muted-foreground text-[14px]">{firstSelectName}</p>
              <Select>
                <SelectTrigger className={'bg-white dark:bg-zinc-900'}>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-[14px] font-[500]">
              <p className="mb-1 text-muted-foreground text-[14px]">{secondSelectName}</p>
              <Select>
                <SelectTrigger className={'bg-white dark:bg-zinc-900'}>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-[14px] font-[500]">
              <p className="mb-1 text-muted-foreground text-[14px]">{thirdSelectName}</p>
              <Select>
                <SelectTrigger className={'bg-white dark:bg-zinc-900'}>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
