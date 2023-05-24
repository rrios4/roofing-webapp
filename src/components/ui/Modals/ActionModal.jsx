import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Flex,
  ModalContent,
  Box
} from '@chakra-ui/react';
import { RefreshCcw } from 'lucide-react';
import React from 'react';

const ActionModal = (props) => {
  const { header, initialRef, finalRef, isOpen, onClose, onSubmit } = props;
  const handleOnClick = (e) => {
    e.preventDefault();
    onSubmit();
    onClose();
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: 'full', md: 'lg' }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex gap={4}>
            <Box my={'auto'}>
              <RefreshCcw size={'20px'} />
            </Box>
            <Text fontWeight={'bold'}>{header}</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={'4'} fontWeight={'medium'}>
            Are you sure you want to continue? ⚠️
          </Text>
          <Text fontWeight={'regular'}>
            The process works by using the quote information and creating a new invoice from it.
            Once the invoice is created the column in quote named <Text as="span">invoiced</Text>{' '}
            will be filled with the quote total. This will signify that the quote has been converted
            and can no longer be used again to create a new invoice.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleOnClick}>
            Convert to Invoice
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ActionModal;
