import React from 'react';
import { SelectItem } from './ui/select';

type Props = {
  data: any | undefined;
};

export default function DefaultSelectDataItems({ data }: Props) {
  return (
    <>
      {data ? (
        data?.map((item: any, index: number) => (
          <React.Fragment key={index}>
            <SelectItem value={item.id.toString()} className="hover:cursor-pointer">
              {item.name}
            </SelectItem>
          </React.Fragment>
        ))
      ) : (
        <SelectItem value="" disabled>
          No items available in DB ❌
        </SelectItem>
      )}
    </>
  );
}
