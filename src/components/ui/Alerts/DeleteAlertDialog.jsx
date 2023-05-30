import React from 'react';
import {
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Button,
  Flex,
  Box
} from '@chakra-ui/react';
import { Trash2 } from 'lucide-react';

const DeleteAlertDialog = (props) => {
  const { body, isOpen, onClose, header, entityDescription, loadingState, onSubmit } = props;

  // Handles the onClick when button is pressed and executes obSubmit from prop
  const handleOnClick = (e) => {
    e.preventDefault();
    onSubmit();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'lg' }} isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Flex mt={'4'} w={'full'}>
            <Box w={'20%'} mx={'auto'}>
              <Flex
                w={'80px'}
                h={'80px'}
                mx={'auto'}
                justifyContent={'center'}
                p={'3'}
                bg={useColorModeValue('red.50', 'red.200')}
                rounded={'full'}>
                <Flex
                  w={'full'}
                  h={'full'}
                  bg={useColorModeValue('red.100', 'red.300')}
                  rounded={'full'}
                  justifyContent={'center'}>
                  <Flex w={'full'} flexDir={'column'} justify={'center'} mx={'auto'}>
                    <Flex w={'full'} justify={'center'}>
                      <Trash2 size={'20px'} color="darkred" />
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Box>
            <Box w={'80%'} mx={'2'} px={'2'}>
              <Text fontSize={'18px'} fontWeight={'600'}>
                Delete{' '}
                <Text as={'span'} textTransform={'lowercase'}>
                  {entityDescription}
                </Text>
              </Text>
              <Text fontSize={'14px'}>{body}</Text>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme={'red'} onClick={handleOnClick} isLoading={loadingState}>
            Delete
          </Button>
          <Button variant={'solid'} ml={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteAlertDialog;
