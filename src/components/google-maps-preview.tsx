import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { CompassIcon } from 'lucide-react';

type Props = {
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  addressQuery: string;
};

export default function GoogleMapsAddressPreviewPopover({
  streetAddress,
  city,
  state,
  zipcode,
  addressQuery
}: Props) {
  return (
    <Popover>
      <PopoverTrigger>
        <div
          className="flex gap-1 font-[400] text-[14px] cursor-pointer hover:text-blue-500"
          // onClick={() =>
          //   window.open(
          //     `https://www.google.com/maps/search/?api=1&query=${customer.street_address}+${customer.city}+${customer.state}+${customer.zipcode}`
          //   )
          // }
        >
          <p>{streetAddress}</p>
          <p>{city},</p>
          <p>{state}</p>
          <p>{zipcode}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full h-full px-6 py-6">
        <iframe
          src={`https://maps.google.com/maps?f=q&source=s_q&hl=en&geocode=&q='${addressQuery}'&z=14&output=embed`}
          width="600"
          height="320"
          className="border mx-auto my-auto rounded-lg bg-secondary"
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"></iframe>
        <div className="flex justify-between pt-6">
          <div>
            <p className="text-[20px] font-[600]">{streetAddress}</p>
            <p className="font-[400]">
              {city}, {state} {zipcode}
            </p>
          </div>
          <div>
            <Button
              variant={'primary'}
              onClick={() =>
                window.open(`https://www.google.com/maps/search/?api=1&query=${addressQuery}`)
              }>
              <CompassIcon className="h-4 w-4 mr-4" />
              Visit Google Maps
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
