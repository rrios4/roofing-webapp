import React from 'react';
import { Flex, IconButton, Tooltip, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export default function Toggle() {
    const {colorMode, toggleColorMode } = useColorMode();
    return (
        <div>
            <Flex align='center' justify='center' height='4rem' direction='column'>
                <Tooltip label='Toggle Dark Mode'>
                    <IconButton onClick={() => toggleColorMode()} fontSize='35px' colorScheme='yellow' variant='ghost' aria-label='Toggle Dark Mode' icon={<MoonIcon />}/>
                </Tooltip>
            </Flex>
            
        </div>
    )
}