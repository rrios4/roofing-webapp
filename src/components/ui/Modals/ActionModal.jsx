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
  const {
    header,
    initialRef,
    finalRef,
    isOpen,
    onClose,
    onSubmit,
    alertQuestion,
    actionBody,
    headerIcon,
    isLoading,
    actionButtonMsg
  } = props;
  const handleOnClick = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: 'full', md: 'xl' }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex gap={4}>
            <Box my={'auto'}>{headerIcon}</Box>
            <Text fontWeight={'bold'}>{header}</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={'2'} fontWeight={'bold'} textColor={'yellow.500'}>
            {alertQuestion}
          </Text>
          <Text fontWeight={'regular'}>{actionBody}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleOnClick} isLoading={isLoading}>
            {actionButtonMsg}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ActionModal;
