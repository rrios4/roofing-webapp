import React from 'react';
import { Button } from '../components/ui/button';
import DefaultStatusBadge from '../components/status-badges';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, HomeIcon } from 'lucide-react';

type Props = {};

export default function PageNotFound() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-2);
    // console.log(navigate(-1));
  };
  return (
    <div className="flex flex-col w-screen-md gap-2 mt-[150px] mb-8">
      <div className="w-[100px] mx-auto">
        <DefaultStatusBadge variant="gray" title="404 error" />
      </div>
      <p className="text-[32px] lg:text-[48px] font-[600] mx-auto">{"We can't find this page"}</p>
      <p className="text-center text-muted-foreground">
        {"The page you are looking for doesn't exist or has been moved."}
      </p>
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 mt-8 gap-4">
        <Button variant={'secondary'} onClick={goBack} className="">
          <ChevronLeftIcon className="w-4 h-4 mr-4" />
          Go Back
        </Button>
        <Button className="" variant={'primary'} asChild>
          <Link to={'/'}>
            <HomeIcon className="w-4 h-4 mr-4" />
            Go home
          </Link>
        </Button>
      </div>
    </div>
  );
}
