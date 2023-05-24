import React, { useEffect, useState } from 'react';
import ActionModal from '../../Modals/ActionModal';
import { Text } from '@chakra-ui/react';
import { RefreshCcw } from 'lucide-react';
import { supabase } from '../../../../utils';
import { useMutation } from '@tanstack/react-query';
import { createNewInvoice } from '../../../../services/api/invoice';
import { useNavigate } from 'react-router-dom';

const ConnectedConvertQuoteToInvoice = (props) => {
  const {
    isOpen,
    onClose,
    initialRef,
    finalRef,
    header,
    alertQuestion,
    data,
    toast,
    actionButtonMsg
  } = props;
  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState(false);
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState('');
  const currentDate = new Date();
  const twoWeeksFromNow = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);

  const fetchNextInvoiceNumber = async () => {
    const { data, error } = await supabase.rpc('max_invoice_number');
    if (error) {
      console.log(error);
    }
    setNextInvoiceNumber(data + 1);
  };

  useEffect(() => {
    fetchNextInvoiceNumber();
  }, []);

  const handleConvertQuoteSubmit = async () => {
    setLoadingState(true);
    const newInvoiceObject = {
      invoice_number: nextInvoiceNumber,
      customer_id: data?.customer_id,
      service_type_id: data?.service_id,
      invoice_status_id: '2',
      invoice_date: currentDate,
      issue_date: !data?.issue_date ? null : data?.issue_date,
      due_date: twoWeeksFromNow,
      subtotal: data?.subtotal,
      total: data?.total,
      amount_due: data?.total,
      sqft_measurement: data?.measurement_note,
      note: data?.note,
      bill_to: data?.custom_address,
      bill_to_street_address: data?.custom_address === true ? data?.custom_street_address : null,
      bill_to_city: data?.custom_address === true ? data?.custom_city : null,
      bill_to_state: data?.custom_address === true ? data?.custom_state : null,
      bill_to_zipcode: data?.custom_address === true ? data?.custom_zipcode : null,
      bill_from_email: 'rrios.roofing@gmail.com',
      bill_from_street_address: '150 Tallant St',
      bill_from_city: 'Houston',
      bill_from_zipcode: '77076',
      bill_from_state: 'TX',
      cust_note: 'Thank you for your business! 🚀',
      converted_from_quote_number: data.quote_number,
      updated_at: new Date(),
      created_at: new Date()
    };
    mutateCreateNewInvoice(newInvoiceObject);
  };

  const { mutate: mutateCreateNewInvoice } = useMutation(
    (newInvoiceObject) => createNewInvoice(newInvoiceObject),
    {
      onError: (error) => {
        setLoadingState(false);
        onClose();
        toast({
          position: 'top',
          title: `Error Occured Converting to Invoice`,
          description: `${
            error.message ===
            `duplicate key value violates unique constraint "invoice_converted_from_quote_number_key"`
              ? 'This quote has already been converted into a invoice and the invoice already exist. If you want to convert this quote please delete the invoice that was created based from this invoice first.'
              : error.message
          }`,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      },
      onSuccess: (data) => {
        console.log(data);
        mutateConvertQuoteLineToInvoice(data.quote_line_item);
      }
    }
  );

  const { mutate: mutateConvertQuoteLineToInvoice } = useMutation(
    async () =>
      data?.quote_line_item?.map(async (item) => {
        await supabase.from('invoice_line_service').insert([
          {
            invoice_id: parseInt(nextInvoiceNumber),
            service_id: parseInt(data?.service_id),
            fixed_item: true,
            description: item.description,
            qty: 1,
            rate: null,
            amount: item.amount,
            sq_ft: null
          }
        ]);
      }),
    {
      onError: (error) => {
        setLoadingState(false);
        onClose();
        toast({
          position: 'top',
          title: `Error Occured Converting Line Item to Invoice`,
          description: `Error: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      },
      onSuccess: () => {
        setLoadingState(false);
        onClose();
        fetchNextInvoiceNumber();
        navigate(`/invoices/${nextInvoiceNumber}`);
        toast({
          position: 'top',
          title: `Quote Conveted to Invoice #${nextInvoiceNumber} succesfully! 🎉`,
          description: "We've sucessfully converted quote information to an invoice for you!",
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }
    }
  );

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      headerIcon={<RefreshCcw size={'20px'} />}
      header={header}
      alertQuestion={alertQuestion}
      actionBody={<ActionBodyText nextInvoiceNumber={nextInvoiceNumber} />}
      initialRef={initialRef}
      finalRef={finalRef}
      onSubmit={handleConvertQuoteSubmit}
      isLoading={loadingState}
      actionButtonMsg={actionButtonMsg}
    />
  );
};

const ActionBodyText = (props) => {
  const { nextInvoiceNumber } = props;
  return (
    <>
      <Text>
        The next invoice number will be:{' '}
        <Text as="span" fontWeight={'bold'} textColor={'blue.500'}>
          {nextInvoiceNumber}
        </Text>
      </Text>
      <Text fontWeight={'bold'} fontSize={'xs'} mb={'2'}>
        (You will automatically pushed to the new invoice)
      </Text>
      The process works by using the quote information and creating a new invoice from it. This
      process will also copy the line items of the quote into the new invoice and will automactilly
      assign the next invoice to the converted invoice. While at the same time assign automatically
      a expiration date that is 2 weeks from the current date.
    </>
  );
};

export default ConnectedConvertQuoteToInvoice;
