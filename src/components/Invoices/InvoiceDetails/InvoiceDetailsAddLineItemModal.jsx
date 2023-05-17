import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Flex,
  Box,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button
} from '@chakra-ui/react';

const InvoiceDetailsAddLineItemModal = (props) => {
  const {
    onAddLineItemClose,
    isAddLineItemOpen,
    handleAddLineItemSubmit,
    setDescriptionLineItemInput,
    setAmountLineItemInput,
    invoiceLineItemLoadingState
  } = props;
  return (
    <>
      <Modal
        onClose={onAddLineItemClose}
        isOpen={isAddLineItemOpen}
        size="xl"
        isCentered
        motionPreset="scale">
        <ModalOverlay />
        <form method="POST" onSubmit={handleAddLineItemSubmit}>
          <ModalContent>
            <ModalHeader>Add Line Item</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex gap="4">
                <Box w="60%">
                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Input onChange={(e) => setDescriptionLineItemInput(e.target.value)} />
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
                    <Input onChange={(e) => setAmountLineItemInput(e.target.value)} />
                  </FormControl>
                </Box>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Flex gap="4">
                <Button colorScheme="blue" type="submit" isLoading={invoiceLineItemLoadingState}>
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

export default InvoiceDetailsAddLineItemModal;
