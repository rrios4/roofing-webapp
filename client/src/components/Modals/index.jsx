import React from 'react';
import {Modal, ModalContent, ModalOverlay, Flex} from '@chakra-ui/react';

const index = (props) => {
  const { variant, children, onClose, isOpen, onOpen, initialRef, bg } = props
  return (
    <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} motionPreset={'slideInBottom'}>
      <ModalOverlay/>
      <ModalContent zIndex={'9990'} roundedRight={'25'} w={'450px'} h='100vh' position={'fixed'} left={'100px'} top={'-60px'} bg={bg}>
      <Flex pl={'4rem'} pr={'3rem'} py={'2rem'} flexDirection={'column'} left={'0px'} top={'0px'} w={'450px'} minH={'100vh'} overflow={'auto'}>
          <Flex flexDir={'column'}>
              {children}
          </Flex>
      </Flex>
      </ModalContent>
    </Modal>
  )
}

export default index