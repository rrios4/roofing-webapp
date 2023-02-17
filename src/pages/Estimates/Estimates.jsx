import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Flex,
  useToast,
  useColorModeValue,
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
import AsyncSelect from 'react-select/async';
import supabase from '../../utils/supabaseClient';
import { MdPostAdd, MdSearch, MdFilterList, MdFilterAlt } from 'react-icons/md';
import { NewEstimateForm, QuoteTable, ConnectedQuoteDeleteAlertDialog } from '../../components';
import { TbRuler } from 'react-icons/tb';
import { useQuotes } from '../../hooks/useQuotes';

function Estimates() {
  // React Hooks
  const { quotes, fetchQuotes, quotesLoadingStateIsOn } = useQuotes();

  // Chakra UI Hooks
  const initialRef = React.useRef();
  const toast = useToast();
  const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  // States to manage data
  const [selectedEstimateId, setSelectedEstimateId] = useState('');
  const [selectedEstimateNumber, setSelectedEstimateNumber] = useState('');

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

  return (
    <>
      <NewEstimateForm initialRef={initialRef} isOpen={isNewOpen} onClose={onNewClose} />
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
                  <Tooltip label="Create New Estimate">
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
                <QuoteTable data={quotes} handleDelete={handleDelete} />
              </>
            )}
          </CardBody>
        </Card>
      </VStack>
    </>
  );
}

export default Estimates;
