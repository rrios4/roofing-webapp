import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { ChevronRightIcon, MailIcon, MapPinIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  customerId: number;
};

export default function CustomerPreviewPopover({
  avatarUrl,
  firstName,
  lastName,
  email,
  phoneNumber,
  streetAddress,
  city,
  state,
  zipcode,
  customerId
}: Props) {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex gap-3">
          <Avatar className="border bg-blue-100 dark:bg-blue-700/30">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              {`${firstName.substring(0, 1)}${lastName.substring(0, 1)}`}
            </AvatarFallback>
          </Avatar>
          <div className="-space-y-0 my-auto">
            <div className="flex gap-1 font-[600]">
              <p>{firstName}</p>
              <p>{lastName}</p>
            </div>
            <p className=" text-xs font-[300]">{email}</p>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] h-[400px] p-6">
        <div className="w-full h-full">
          <div className="w-full">
            <Avatar className="border w-[120px] h-[120px] mx-auto bg-blue-100 dark:bg-blue-700/30">
              <AvatarImage src={avatarUrl} sizes="xl" className="mx-auto" />
              <AvatarFallback className={'text-4xl'}>
                {`${firstName.substring(0, 1)}${lastName.substring(0, 1)}`}
              </AvatarFallback>
            </Avatar>
          </div>
          <p className="mx-auto text-center mt-4 font-[600] text-[24px] mb-2">
            {firstName} {lastName}
          </p>
          <p className="text-center font-[400] text-muted-foreground">{email}</p>
          <p className="text-center font-[400] text-muted-foreground mb-2">{phoneNumber}</p>
          <p className="text-center font-[400] text-muted-foreground">{streetAddress}</p>
          <p className="text-center font-[400] text-muted-foreground">
            {city}, {state} {zipcode}
          </p>
          <div className="grid w-full grid-flow-row grid-cols-3 mt-6 gap-4">
            <Button asChild variant={'primary'}>
              <a href={`mailto:${email}`} target="_blank" rel="noreferrer">
                <MailIcon size={'18px'} />
              </a>
            </Button>
            <Button
              variant={'primary'}
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${streetAddress}+${city}+${state}+${zipcode}`
                )
              }>
              <MapPinIcon size={'18px'} />
            </Button>
            <Button asChild variant={'primary'}>
              <Link to={`/customers/${customerId}`}>
                <ChevronRightIcon size={'18px'} />
              </Link>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
