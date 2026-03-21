import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { CompassIcon } from 'lucide-react';

type Props = {
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  addressQuery: string;
  textSize?: string | null;
};

export default function GoogleMapsAddressPreviewPopover({
  streetAddress,
  city,
  state,
  zipcode,
  addressQuery,
  textSize
}: Props) {
  const addressTriggerContent = (
    <>
      {!textSize && (
        <div className="flex gap-1 font-[400] text-[14px] cursor-pointer hover:text-blue-500">
          <p>{streetAddress}</p>
          <p>{city},</p>
          <p>{state}</p>
          <p>{zipcode}</p>
        </div>
      )}
      {textSize === 'md' && (
        <div className="flex gap-1 font-[400] text-[16px] cursor-pointer hover:text-blue-500">
          <p>{streetAddress}</p>
          <p>{city},</p>
          <p>{state}</p>
          <p>{zipcode}</p>
        </div>
      )}
      {textSize === 'sm' && (
        <div className="flex gap-1 font-light text-sm cursor-pointer hover:text-blue-500">
          <p>{streetAddress}</p>
          <p>{city},</p>
          <p>{state}</p>
          <p>{zipcode}</p>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop / tablet: Popover (md and above) */}
      <div className="hidden md:block">
        <Popover>
          <PopoverTrigger>{addressTriggerContent}</PopoverTrigger>
          <PopoverContent className="w-full h-full px-6 py-6">
            <iframe
              src={`https://maps.google.com/maps?f=q&source=s_q&hl=en&geocode=&q='${addressQuery}'&z=14&output=embed`}
              className="border mx-auto my-auto rounded-lg bg-secondary w-[300px] h-[200px] md:w-[600px] md:h-[320px]"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"></iframe>
            <div className="flex justify-between pt-6 flex-col md:flex-row gap-4">
              <div className="w-full">
                <p className="text-[20px] font-[600]">{streetAddress}</p>
                <p className="font-[400]">
                  {city}, {state} {zipcode}
                </p>
              </div>
              <div className="w-full md:w-[300px]">
                <Button
                  className="w-full"
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
      </div>

      {/* Mobile: bottom Sheet (below md) */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <div>{addressTriggerContent}</div>
          </SheetTrigger>
          <SheetContent side="bottom" className="px-6 pb-8 pt-4 rounded-t-2xl">
            <SheetHeader className="mb-4">
              <SheetTitle>Preview address on Google Maps</SheetTitle>
            </SheetHeader>
            <iframe
              src={`https://maps.google.com/maps?f=q&source=s_q&hl=en&geocode=&q='${addressQuery}'&z=14&output=embed`}
              className="border rounded-lg bg-secondary w-full h-[200px]"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"></iframe>
            <p className="text-sm text-muted-foreground mt-3">
              {streetAddress}, {city}, {state} {zipcode}
            </p>
            <Button
              className="w-full mt-4"
              variant={'primary'}
              onClick={() =>
                window.open(`https://www.google.com/maps/search/?api=1&query=${addressQuery}`)
              }>
              <CompassIcon className="h-4 w-4 mr-4" />
              Open in Google Maps
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
