import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../ui/sheet';
import { Button } from '../ui/button';
import { PencilIcon } from 'lucide-react';
import UpdateQuoteForm from './update-quote-form';
import { useFetchQuoteById } from '../../hooks/useAPI/use-quotes';
import { Quote } from '../../types/db_types';

type Props = {
  quote: Quote;
  trigger?: React.ReactNode;
};

/**
 * UpdateQuoteSheet Component
 *
 * A sheet component that wraps the UpdateQuoteForm for editing an existing quote.
 * This component handles loading the quote data and line items before rendering the form.
 *
 * @param quote - The quote object to be updated
 * @param trigger - Optional custom trigger element, defaults to a pencil icon button
 */
export default function UpdateQuoteSheet({ quote, trigger }: Props) {
  // Fetch the full quote data and line items
  const { quoteById, isLoading, isError } = useFetchQuoteById(quote.quote_number);

  const defaultTrigger = (
    <Button variant="ghost" size="sm">
      <PencilIcon className="h-4 w-4" />
      Edit Quote
    </Button>
  );

  if (isError) {
    return <div className="text-red-500 text-sm">Error loading quote data</div>;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>

      <SheetContent className="w-full md:w-[600px] sm:max-w-none overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Update Quote #{quote.quote_number}</SheetTitle>
          <SheetDescription>
            Make changes to the quote details, line items, and notes.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : quoteById ? (
          <UpdateQuoteForm
            quote={quoteById}
            quoteLineItems={(quoteById as any).quote_line_item || []}
          />
        ) : (
          <div className="text-gray-500 text-sm py-4">Quote not found</div>
        )}
      </SheetContent>
    </Sheet>
  );
}
