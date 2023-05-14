import React from 'react';
import {
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalFooter,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button
} from '@chakra-ui/react';

const QuoteDetailsAddLineItemModal = (props) => {
  const {
    handleAddLineItemSubmit,
    onAddLineItemClose,
    isAddLineItemOpen,
    setLineItemAmountInput,
    setLineItemDescriptionInput,
    loadingQuoteStatusIsOn
  } = props;
  return (
    <>
      <Modal
        onClose={onAddLineItemClose}
        isOpen={isAddLineItemOpen}
        size={'xl'}
        isCentered
        motionPreset="scale">
        <ModalOverlay />
        <form method={'POST'} onSubmit={handleAddLineItemSubmit}>
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>Add Line Item</ModalHeader>
            <ModalBody>
              <Flex gap="4">
                <Box w="60%">
                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Input onChange={(e) => setLineItemDescriptionInput(e.target.value)} />
                  </FormControl>
                </Box>
                <Box w="15%">
                  <FormControl isRequired>
                    <FormLabel>Qty</FormLabel>
                    <Input value="1" disabled />
                  </FormControl>
                </Box>
                <Box w="20%">
                  <FormControl isRequired>
                    <FormLabel>Rate</FormLabel>
                    <Input value="Fixed" disabled />
                  </FormControl>
                </Box>
                <Box w="25%">
                  <FormControl isRequired>
                    <FormLabel>Amount</FormLabel>
                    <Input onChange={(e) => setLineItemAmountInput(e.target.value)} />
                  </FormControl>
                </Box>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Flex gap="4">
                <Button colorScheme="blue" type="submit" isLoading={loadingQuoteStatusIsOn}>
                  Add Line Item
                </Button>
                <Button onClick={onAddLineItemClose}>Cancel</Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default QuoteDetailsAddLineItemModal;
