import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton
} from '@chakra-ui/react';

const index = (props) => {
  const { variant, children, onClose, isOpen, onOpen, initialRef, bg, size } = props;

  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen} size={size}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody flexDir={'column'} px={'2rem'} pt={'2rem'} pb={'2rem'}>
          {children}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default index;
