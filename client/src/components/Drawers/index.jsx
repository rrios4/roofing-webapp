import React from 'react';
import { Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerCloseButton} from '@chakra-ui/react';

const index = (props) => {
  const { variant, children, onClose, isOpen, onOpen, initialRef, bg } = props

  return (
    <Drawer placement='right' onClose={onClose} isOpen={isOpen} size='md'>
      <DrawerOverlay/>
      <DrawerContent>
      <DrawerCloseButton/>
        <DrawerBody flexDir={'column'} px={'3rem'} pt={'2rem'} pb={'3rem'}>
            {children}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default index