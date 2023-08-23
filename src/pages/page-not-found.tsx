import React from 'react';
import { Button } from '../components/ui/button';
import DefaultStatusBadge from '../components/status-badges';
import { Link } from 'react-router-dom';

type Props = {};

export default function PageNotFound({}: Props) {
  return (
    <div className="flex flex-col w-screen-md gap-2 mt-[150px] mb-8">
      <div className="w-[100px] mx-auto">
        <DefaultStatusBadge variant="blue" title="404 error" />
      </div>
      <p className="text-[32px] lg:text-[48px] font-[600] mx-auto">We can't find this page</p>
      <p className="text-center text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to={'/'} className="mx-auto mt-4">
        <Button className="w-[180px]" variant={'primary'}>
          Go home
        </Button>
      </Link>
    </div>
  );
}
