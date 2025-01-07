import React from 'react';
import { SelectItem } from './ui/select';
import { IDbQuoteRequestStatus } from '../types/global_types';

type Props = {
  data?: IDbQuoteRequestStatus[];
};

export default function DefaultSelectDataItems({ data }: Props) {
  return (
    <>
      {data && data.length > 0 ? (
        data.map((item) => (
          <SelectItem key={item.id} value={item.id.toString()} className="hover:cursor-pointer">
            {item.name}
          </SelectItem>
        ))
      ) : (
        <SelectItem value=" " disabled>
          No items available in DB ❌
        </SelectItem>
      )}
    </>
  );
}
