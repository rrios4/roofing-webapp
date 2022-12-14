import React from 'react';
import { Navbar } from '../';
import { Flex } from '@chakra-ui/react';
import { useColorModeValue } from "@chakra-ui/react";

const Layout = (props) => {
  const bg = useColorModeValue('gray.100', 'gray.800')
  return (
    <Flex bg={bg}>
        <header>
            <Navbar/>
        </header>
        <Flex w={'full'} minH={'100vh'} pl={{base:'0rem', lg:'6rem'}} mt={{base:'4rem', lg:'0rem'}} justifyContent='center'>
            {props.children}
        </Flex>
    </Flex>
  )
}

export default Layout