import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

type Props = {};

export default function CustomerInfoPage({}: Props) {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col mt-2 border py-4 px-4 rounded-md gap-8">
        <div className="flex flex-col md:flex-row w-full gap-4 justify-between">
          <div className="flex gap-4">
            <div>
              <Avatar className="w-[50px] h-[50px]">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>LS</AvatarFallback>
              </Avatar>
            </div>
            <div className="my-auto">
              <p className="font-bold text-[24px] my-auto">Lucia Satterfield-White</p>
            </div>
            <div className="my-auto">
                <Badge variant={'blue'}>Residential</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button>Edit</Button>
            <Button>Delete</Button>
          </div>
        </div>
        <div className="grid grid-flow-col grid-rows-2 md:grid-rows-1 gap-6 px-1">
          <div>
            <p className="text-gray-500 font-semibold text-[14px]">Email</p>
            <p>i.satterfieldwhite@gmail.com</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold text-[14px]">Phone Number</p>
            <p>{'(239) 231 5824'}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold text-[14px]">Main Address</p>
            <p>2123 River Oaks St Houston, TX 77076</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold text-[14px]">Market</p>
            <p>Houston, TX 🇺🇸</p>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex w-full justify-start py-6 px-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">This will display customers invoices and quotes...</TabsContent>
          <TabsContent value="locations">This is a location where the customer can add multiple addresses to their account.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
