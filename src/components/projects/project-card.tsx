import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Project } from '../../types/project-types';
import { formatCurrency } from '../../lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Calendar1Icon,
  CircleCheckBigIcon,
  FileIcon,
  ImageIcon,
  MapPinIcon,
  Maximize2Icon,
  MoreVerticalIcon,
  PackageIcon,
  PinIcon
} from 'lucide-react';
import { Button } from '../ui/button';

interface ProjectCardProps {
  project: Project;
  isDragging?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: dndIsDragging
  } = useDraggable({
    id: project.id
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: dndIsDragging ? 0.5 : undefined
  };

  const getSourceColor = (source?: string) => {
    switch (source) {
      case 'Website':
        return 'bg-blue-100 text-blue-800';
      case 'Referral':
        return 'bg-green-100 text-green-800';
      case 'Advertisement':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`min-w-[380px] mb-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
        dndIsDragging ? 'ring-2 ring-primary/50' : ''
      }`}
      {...attributes}
      {...listeners}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium leading-tight">
          <div className="flex gap-3 w-full justify-between">
            <div className="flex gap-3">
              <Avatar className="max-w-[35px] max-h-[35px] text-xs">
                <AvatarFallback>RR</AvatarFallback>
              </Avatar>
              <p className="my-auto">Rogelio Rios</p>
              <Badge variant="outline" className="text-xs bg-blue-500 text-white my-1">
                Residential
              </Badge>
            </div>
            <div>
              <Button size={'sm'} variant={'ghost'}>
                <MoreVerticalIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardTitle>
        {/* <div className="flex items-center justify-between">
          {project.jobValue && (
            <span className="text-lg font-semibold text-green-600">
              {formatCurrency(project.jobValue)}
            </span>
          )}
          {project.hasInsurance && (
            <Badge variant="outline" className="text-xs">
              Insurance
            </Badge>
          )}
        </div> */}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col w-full my-1 py-1 px-2 gap-2.5">
          <div className="flex gap-1">
            <MapPinIcon className="inline-block w-4 h-4 mr-2 my-auto text-gray-400" />
            <p className="text-sm">{project.jobAddress}</p>
          </div>
          <div className="flex gap-1">
            <Calendar1Icon className="inline-block w-4 h-4 mr-2 my-auto text-gray-400" />
            <p className="text-sm">Nov 1, 2025 - Nov 14, 2025</p>
          </div>
          <div className="flex gap-1">
            <PackageIcon className="inline-block w-4 h-4 mr-2 my-auto text-gray-400" />
            <p className="text-sm">Roofing Installation</p>
          </div>
        </div>

        {/* <div className="space-y-2">
          {project.assignedTo && (
            <div className="flex items-center text-xs text-gray-600">
              <span className="font-medium">Assigned to:</span>
              <span className="ml-1">{project.assignedTo}</span>
            </div>
          )}

          {project.source && (
            <Badge className={`text-xs ${getSourceColor(project.source)}`} variant="secondary">
              {project.source}
            </Badge>
          )}

          {project.closeDate && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">Close Date:</span>
              <span className="ml-1">{new Date(project.closeDate).toLocaleDateString()}</span>
            </div>
          )}

          {project.details && (
            <p className="text-xs text-gray-600 line-clamp-2">{project.details}</p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
            {project.customerId && (
              <Badge variant="outline" className="text-xs">
                Customer
              </Badge>
            )}
            {project.quoteId && (
              <Badge variant="outline" className="text-xs">
                Quote
              </Badge>
            )}
            {project.invoiceId && (
              <Badge variant="outline" className="text-xs">
                Invoice
              </Badge>
            )}
          </div>
        </div> */}
      </CardContent>
      <CardFooter className="pb-5">
        <div className="flex w-full justify-between gap-2">
          <div className="flex w-full gap-3 px-2">
            <div className="flex">
              <CircleCheckBigIcon className="inline-block w-4 h-4 mr-2 my-auto text-gray-400" />
              <p className="text-sm my-auto">3</p>
            </div>
            <div className="flex">
              <FileIcon className="inline-block w-4 h-4 mr-2 my-auto text-gray-400" />
              <p className="text-sm my-auto">1</p>
            </div>
            <div className="flex">
              <ImageIcon className="inline-block w-4 h-4 mr-2 my-auto text-gray-400" />
              <p className="text-sm my-auto">1</p>
            </div>
          </div>
          {/* <Button size={'sm'} variant={'ghost'}>
            <Maximize2Icon className="inline-block w-3 h-3 my-auto" />
          </Button> */}
        </div>
      </CardFooter>
    </Card>
  );
};
