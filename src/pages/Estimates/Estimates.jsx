import React, { useState, useEffect } from 'react';
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
  EditQuoteForm
} from '../../components';
import { TbRuler } from 'react-icons/tb';
import { useQuotes } from '../../hooks/useQuotes';
import { useServices } from '../../hooks/useServices';
import { useQuoteStatuses } from '../../hooks/useQuoteStatuses';
import { supabase } from '../../utils';

function Estimates() {
  // React Hooks
  const { quotes, fetchQuotes, quotesLoadingStateIsOn } = useQuotes();
  const { services } = useServices();
  const { quoteStatuses } = useQuoteStatuses();

  // Chakra UI Hooks
  const initialRef = React.useRef();
  const toast = useToast();
  const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

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

  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchEstimateInput, setSearchEstimateInput] = useState('');

  //React Render Hook
  useEffect(() => {
    // getAllQuotes();
    // getCustomers();
  }, []);

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

    const { data, error } = await supabase
      .from('quote')
      .update({
        status_id: selectedEditQuote.status_id,
        service_id: selectedEditQuote.service_id,
        quote_date: selectedEditQuote.quote_date ? selectedEditQuote.quote_date : null,
        issue_date: selectedEditQuote.issue_date ? selectedEditQuote.issue_date : null,
        expiration_date: selectedEditQuote.expiration_date
          ? selectedEditQuote.expiration_date
          : null,
        note: selectedEditQuote.note,
        measurement_note: selectedEditQuote.measurement_note,
        cust_note: selectedEditQuote.cust_note,
        updated_at: new Date()
      })
      .eq('quote_number', selectedEditQuote.quote_number);

    if (error) {
      toast({
        position: 'top',
        title: `Error Updating Quote Number ${selectedEditQuote.quote_number}`,
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
    if (data) {
      await fetchQuotes();
      onEditClose();
      toast({
        position: 'top',
        title: `Successfully Updated Quote - ${selectedEditQuote.quote_number}!`,
        description: `We've updated quote information for you 🎉`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }

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
        updateParentState={fetchQuotes}
        toast={toast}
        data={quotes}
      />
      <ConnectedQuoteDeleteAlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onOpen={onDeleteOpen}
        toast={toast}
        updateParentState={fetchQuotes}
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
      />
      <VStack my={'2rem'} w="100%" mx={'auto'} px={{ base: '1rem', lg: '2rem' }}>
        {/* <Box display={'flex'} marginBottom={'0rem'} justifyContent="start" w="full">
          <Link to={'/'}>
            <Button
              colorScheme={buttonColorScheme}
              ml={'1rem'}
              mb="1rem"
              leftIcon={<MdKeyboardArrowLeft size={'20px'} />}>
              Back
            </Button>
          </Link>
        </Box> */}
        <Card variant={'outline'} width="full" rounded={'xl'} shadow={'sm'} size={'lg'}>
          <CardBody>
            <HStack mb={'24px'} mx={'1rem'}>
              <Flex display={'flex'} mr={'auto'} alignItems={'center'} gap={8}>
                <Flex>
                  <Icon as={TbRuler} boxSize={'6'} my={'auto'} />
                  <Text fontSize={'2xl'} fontWeight="semibold" mx="14px">
                    Quotes
                  </Text>
                </Flex>
                <Flex>
                  <form method="GET" onSubmit={searchEstimate}>
                    <FormControl display={'flex'}>
                      <Input
                        value={searchEstimateInput}
                        onChange={({ target }) => setSearchEstimateInput(target.value)}
                        placeholder="Search for Quotes"
                        colorScheme="blue"
                        size={'md'}
                      />
                      <Tooltip label="Search">
                        <IconButton ml={'1rem'} type="submit" icon={<MdSearch />} />
                      </Tooltip>
                    </FormControl>
                  </form>
                </Flex>
              </Flex>
              <Flex justifyContent={'end'} gap={10}>
                <Flex gap={4}>
                  <Tooltip label="Filter">
                    <IconButton colorScheme={'gray'} icon={<MdFilterAlt />} />
                  </Tooltip>
                  <Tooltip label="Sort">
                    <IconButton colorScheme={'gray'} icon={<MdFilterList />} />
                  </Tooltip>
                  <Tooltip label="Create a new quote">
                    <IconButton
                      colorScheme="blue"
                      variant="solid"
                      onClick={onNewOpen}
                      icon={<MdPostAdd />}
                    />
                  </Tooltip>
                </Flex>
              </Flex>
            </HStack>
            {/* Table for all all quotes from DB */}
            {quotesLoadingStateIsOn === true ? (
              <Box w={'full'} h={'200px'}>
                <Skeleton h={'200px'} rounded={'xl'} />
              </Box>
            ) : (
              <>
                <QuoteTable
                  data={quotes}
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
