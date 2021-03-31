import React from 'react';
import {Box, Text, Flex, UnorderedList, ListItem, Link, Image, Avatar, AvatarBadge, AvatarGroup, Divider, Tooltip} from '@chakra-ui/react';
import HomeIcon from '@material-ui/icons/Home'


const Navbar = () => {
    return (
        <main>
        <Flex position='fixed' w='9rem' h='100vh' bg='gray.700' roundedTopRight='25' roundedBottomRight='25' flexDir='column' p='0' m='0'>
            <Box display='flex' flexDir='column' h='9rem' bg='blue.500' roundedRight='25' justifyContent='center'>
                
            </Box>
            <Box display='flex' justifyContent='center' marginTop='auto' paddingBottom='2rem' color='white' _hover={'color: red'}>
                <Link>
                    <Tooltip label='Home' bg="gray.500">
                        <HomeIcon fontSize='large'/>
                    </Tooltip>
                </Link>

            </Box>
            <Box>
                <Divider orientation="horizontal"/>
            </Box>
            <Box display="flex" color='white' justifyContent='center' paddingTop='2rem' paddingBottom='2rem'>
                <Tooltip label='SimplyNex' bg="gray.500">
                    <Avatar shadow='sm' size='lg' src='https://64.media.tumblr.com/073578da50f557bd56caef112e255950/b754da231bb4bd69-34/s640x960/4f8c9cf93d4f03c42d448eba0dac2a9cbb2a69e2.jpg'/>
                </Tooltip>
            </Box>
            

        </Flex>
        </main>
    )
}

export default Navbar
