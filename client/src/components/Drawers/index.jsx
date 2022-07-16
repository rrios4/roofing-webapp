import React from 'react';
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton} from '@chakra-ui/react';
import { MdOutlineClose } from 'react-icons/md'

const index = (props) => {
  const { variant, children, onClose, isOpen, onOpen, initialRef, bg } = props

  return (
    <Drawer placement='right' onClose={onClose} isOpen={isOpen} size='md'>
      <DrawerOverlay bg={'none'} backdropFilter={'auto'} backdropBlur='2px'/>
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