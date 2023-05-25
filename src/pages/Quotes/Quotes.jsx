import React, { useState } from 'react';
import {
  Box,
  Flex,
  useToast,
  HStack,
  Tooltip,
  FormControl,
  Input,
  Text,
  useDisclosure,
  VStack,
  IconButton,
  Icon,
  Card,
  CardBody,
  Skeleton
} from '@chakra-ui/react';
import { MdPostAdd, MdSearch, MdFilterList, MdFilterAlt } from 'react-icons/md';
import {
  QuoteTable,
  ConnectedQuoteDeleteAlertDialog,
  CreateQuoteForm,
  EditQuoteForm,
  PageHeader
} from '../../components';
import { TbRuler } from 'react-icons/tb';
import { useFetchQuotes, useSearchQuote, useUpdateQuote } from '../../hooks/useAPI/useQuotes';
import { useQuoteStatuses } from '../../hooks/useAPI/useQuoteStatuses';
// import { useQueryClient } from '@tanstack/react-query';
import useDebounce from '../../hooks/useDebounce';
import { useFetchAllServices } from '../../hooks/useAPI/useServices';

function Estimates() {
  // const queryClient = useQueryClient();

  // Chakra UI Hooks
  const initialRef = React.useRef();
  const toast = useToast();
  const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  // Custom React Hooks
  const { quotes, isLoading: quotesLoadingStateIsOn } = useFetchQuotes();
  const {
    data: services,
    isLoading: isRoofingServicesLoading,
    isError: isRoofingServicesError
  } = useFetchAllServices();
  const { quoteStatuses } = useQuoteStatuses();

  // States to manage data
  const [selectedEstimateId, setSelectedEstimateId] = useState('');
  const [selectedEstimateNumber, setSelectedEstimateNumber] = useState('');
  const [selectedEditQuote, setSelectedEditQuote] = useState({
    id: '',
    quote_number: '',
    status_id: '',
    service_id: '',
    quote_date: '',
    issue_date: '',
    expiration_date: '',
    note: '',
    measurement_note: '',
    cust_note: ''
  });

  const { mutate: mutateUpdateQuote, isLoading: quoteUpdateIsLoading } = useUpdateQuote(toast);

  const [searchQuote, setSearchQuote] = useState('');
  const [searchQuoteInput, setSearchQuoteInput] = useState('');
  const deboundedQuoteSearchTerm = useDebounce(searchQuoteInput, 100);
  const { quoteSearchResult, quoteSearchIsLoading } = useSearchQuote(deboundedQuoteSearchTerm);

  const searchEstimate = async (e) => {
    e.preventDefault();
  };

  // Update this function to handle delete functinality.
  const handleDelete = (estimateId, estimate_number) => {
    setSelectedEstimateId(estimateId);
    setSelectedEstimateNumber(estimate_number);
    onDeleteOpen();
  };

  /////////////////////////// Functions that handle edit functionality ////////////////////////////////
  const handleEditDrawer = (quote) => {
    setSelectedEditQuote({
      id: quote.id,
      quote_number: quote.quote_number,
      status_id: quote.status_id,
      service_id: quote.service_id,
      quote_date: quote.quote_date ? quote.quote_date : '',
      issue_date: quote.issue_date ? quote.issue_date : '',
      expiration_date: quote.expiration_date ? quote.expiration_date : '',
      note: quote.note,
      measurement_note: quote.measurement_note,
      cust_note: quote.cust_note
    });
    onEditOpen();
  };

  const handleEditOnChange = (e) => {
    setSelectedEditQuote({ ...selectedEditQuote, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    mutateUpdateQuote(selectedEditQuote);
    onEditClose();
    setSelectedEditQuote({
      id: '',
      quote_number: '',
      status_id: '',
      service_id: '',
      quote_date: '',
      issue_date: '',
      expiration_date: '',
      note: '',
      measurement_note: '',
      cust_note: ''
    });
  };

  return (
    <>
      <CreateQuoteForm
        initialRef={initialRef}
        isOpen={isNewOpen}
        onClose={onNewClose}
        services={services}
        quoteStatuses={quoteStatuses}
        toast={toast}
        data={quotes}
      />
      <ConnectedQuoteDeleteAlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onOpen={onDeleteOpen}
        toast={toast}
        itemNumber={selectedEstimateNumber}
        header={`Delete Quote`}
        entityDescription={`Quote #${selectedEstimateNumber}`}
        body={`Once you confirm you can't undo this action afterwards. There will be no way to restore the information. 🚨`}
      />
      <EditQuoteForm
        isOpen={isEditOpen}
        onClose={onEditClose}
        onOpen={onEditOpen}
        quote={selectedEditQuote}
        services={services}
        quoteStatuses={quoteStatuses}
        handleEditOnChange={handleEditOnChange}
        handleEditSubmit={handleEditSubmit}
        loadingState={quoteUpdateIsLoading}
      />
      <VStack my={'4'} w="100%" mx={'auto'} px={{ base: '4', lg: '8' }}>
        <PageHeader
          title={'Quotes'}
          subheading={'Manage your quotes to send out to your customers.'}
          addItemButtonText={'Add quote'}
          onOpen={onNewOpen}
        />
        <Card width="full" rounded={'lg'} shadow={'sm'} size={{ base: 'md', md: 'md' }}>
          <CardBody>
            {/* Table for all all quotes from DB */}
            {quotesLoadingStateIsOn === true ? (
              <Box w={'full'} h={'200px'}>
                <Skeleton h={'200px'} rounded={'xl'} />
              </Box>
            ) : (
              <>
                <QuoteTable
                  data={!searchQuoteInput ? quotes : quoteSearchResult}
                  handleDelete={handleDelete}
                  handleEditDrawer={handleEditDrawer}
                />
              </>
            )}
          </CardBody>
        </Card>
      </VStack>
    </>
  );
}

export default Estimates;
