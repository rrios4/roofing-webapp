import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Flex,
  Box,
  Text,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button
} from '@chakra-ui/react';
import { CreditCard } from 'lucide-react';

const InvoiceDetailsAddPaymenyModal = (props) => {
  const {
    onAddPaymentClose,
    isAddPaymentOpen,
    handleAddPaymentSubmit,
    dateReceivedPaymentInput,
    setDateReceivedPaymnetInput,
    paymentMethodPaymentInput,
    setPaymentMethodPaymentInput,
    amountPaymentInput,
    setAmountPaymentInput,
    loadingState
  } = props;
  return (
    <>
      <Modal
        onClose={onAddPaymentClose}
        isOpen={isAddPaymentOpen}
        size={'xl'}
        isCentered
        motionPreset="scale">
        <ModalOverlay />
        <form method="POST" onSubmit={handleAddPaymentSubmit}>
          <ModalContent>
            <ModalHeader shadow={'xs'}>
              <Flex gap={2}>
                <Box my={'auto'}>
                  <CreditCard size={'20px'} />
                </Box>
                <Text>Add Payment</Text>
              </Flex>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex gap={4} my={'2rem'}>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Date Received</FormLabel>
                    <Input
                      name={'date_received'}
                      type={'date'}
                      value={dateReceivedPaymentInput}
                      onChange={(e) => setDateReceivedPaymnetInput(e.target.value)}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Payment Method</FormLabel>
                    <Input
                      name={'payment_method'}
                      value={paymentMethodPaymentInput}
                      onChange={(e) => setPaymentMethodPaymentInput(e.target.value)}
                    />
                  </FormControl>
                </Box>
                <Box w={'20%'}>
                  <FormControl isRequired>
                    <FormLabel>Amount</FormLabel>
                    <Input
                      name={'amount'}
                      type={'number'}
                      value={amountPaymentInput}
                      onChange={(e) => setAmountPaymentInput(e.target.value)}
                    />
                  </FormControl>
                </Box>
              </Flex>
            </ModalBody>
            <ModalFooter gap={4}>
              <Button colorScheme={'blue'} type={'submit'} isLoading={loadingState}>
                Add Payment
              </Button>
              <Button onClick={onAddPaymentClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default InvoiceDetailsAddPaymenyModal;
