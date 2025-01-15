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
          <React.Fragment key={item.id}>
            <SelectItem value={item.id.toString()} className="hover:cursor-pointer">
              {item.name}
            </SelectItem>
          </React.Fragment>
        ))
      ) : (
        <SelectItem value=" " disabled>
          No items available in DB ❌
        </SelectItem>
      )}
    </>
  );
}
