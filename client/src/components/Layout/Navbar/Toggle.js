import React from 'react';
import { Flex, IconButton, Tooltip, useColorMode } from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

export default function Toggle() {
    const {colorMode, toggleColorMode } = useColorMode();
    return (
        <div>
            <Flex align='center' justify='center' height='4rem' direction='column'>
            <Tooltip label={colorMode === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode'}>
            <IconButton onClick={() => toggleColorMode()} fontSize='28px' colorScheme={colorMode === 'light' ? 'yellow' : 'yellow'} variant='ghost' aria-label='Toggle Dark Mode' icon={colorMode === 'light' ? <MdDarkMode />: <MdLightMode/> }/>
        </Tooltip>
            </Flex>
            
        </div>
    )
}