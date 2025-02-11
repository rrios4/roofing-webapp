import React, { useEffect } from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Text,
  Flex,
  Box,
  FormLabel,
  Select,
  Input,
  Textarea,
  Button,
  Avatar
} from '@chakra-ui/react';
import { MultiPurposeOptions } from '../index.js';
import { formatNumber } from '../../../utils';

const EditQuoteForm = (props) => {
  const {
    onClose,
    isOpen,
    quote,
    services,
    quoteStatuses,
    handleEditOnChange,
    handleEditSubmit,
    loadingState
  } = props;
  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen} size={{ base: 'full', md: 'lg' }}>
      <form method="PATCH" onSubmit={handleEditSubmit}>
        <DrawerOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader shadow={'xs'}>Edit Quote #{formatNumber(quote?.quote_number)}</DrawerHeader>
          <DrawerBody>
            <Text fontWeight={'bold'} color={'blue.500'} mt={'0rem'} mb={'1rem'} fontSize={'md'}>
              General Info
            </Text>
            <Flex mb={'1rem'} gap={8}>
              <Box w={'50%'}>
                <FormLabel>Status</FormLabel>
                <Select name="status_id" value={quote?.status_id} onChange={handleEditOnChange}>
                  <MultiPurposeOptions data={quoteStatuses} />
                </Select>
              </Box>
              <Box w={'50%'}>
                <FormLabel>Quote Date</FormLabel>
                <Input
                  name="quote_date"
                  type="date"
                  value={quote?.quote_date}
                  onChange={handleEditOnChange}
                />
              </Box>
            </Flex>
            <Flex gap={8}>
              <Box w={'50%'} mb={'1rem'}>
                <FormLabel>Issue Date</FormLabel>
                <Input
                  name="issue_date"
                  type="date"
                  value={quote?.issue_date}
                  onChange={handleEditOnChange}
                />
              </Box>
              <Box w={'50%'} mb={'1rem'}>
                <FormLabel>Expiration Date</FormLabel>
                <Input
                  name="expiration_date"
                  type="date"
                  value={quote?.expiration_date}
                  onChange={handleEditOnChange}
                />
              </Box>
            </Flex>
            <FormLabel>Select Service</FormLabel>
            <Select name="service_id" value={quote?.service_id} onChange={handleEditOnChange}>
              <MultiPurposeOptions data={services} />
            </Select>
            <Text fontWeight={'bold'} color={'blue.500'} mt={'2rem'} fontSize={'md'}>
              Additional Information
            </Text>
            <Flex gap={4} w="full" mt={'1rem'}>
              <Box w={'50%'}>
                <FormLabel>Internal Note</FormLabel>
                <Textarea
                  h={'200px'}
                  name="private_note"
                  value={quote?.private_note}
                  onChange={handleEditOnChange}
                  placeholder="Here you enter notes regarding the quote that you want to remember..."
                />
              </Box>
              <Box w={'50%'}>
                <FormLabel>Measurements Note</FormLabel>
                <Textarea
                  h={'200px'}
                  name="measurement_note"
                  value={quote?.measurement_note}
                  onChange={handleEditOnChange}
                  placeholder="Here you enter measurements for roof..."
                />
              </Box>
            </Flex>
            <FormLabel my={'1rem'}>Customer Note</FormLabel>
            <Textarea
              h={'200px'}
              name="public_note"
              value={quote?.public_note}
              onChange={handleEditOnChange}
              placeholder="Here you enter customer message you want the customer to see..."
            />
          </DrawerBody>
          <DrawerFooter gap={4}>
            <Button colorScheme={'blue'} type="submit" isLoading={loadingState}>
              Update quote
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export default EditQuoteForm;
