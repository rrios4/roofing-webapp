import React from 'react';
import {Box, Text, Flex, UnorderedList, ListItem, Image, Avatar, AvatarBadge, AvatarGroup, Divider, Tooltip} from '@chakra-ui/react';
import HomeIcon from '@material-ui/icons/Home';
import Toggle from "./Toggle";
import {Link} from 'react-router-dom'


const Navbar = () => {
    return (
        <main>
        <Flex position='fixed' w='9rem' h='100vh' bg='gray.700' roundedTopRight='25' roundedBottomRight='25' flexDir='column' p='0' m='0'>
            <Box display='flex' flexDir='column' h='9rem' bg='blue.400' shadow='xl' roundedRight='25' justifyContent='center' pl='20px'>
                <Image boxSize='100px' src='https://github.com/rrios4/roofing-webapp/blob/main/client/src/assets/LogoRR.png?raw=true'/>
            </Box>
            <Box display='flex' justifyContent='center' marginTop='auto' p='1rem'>
                <Link to='/'>
                    <Box _hover={{bg: "gray.600"}} rounded='md' p='8px' color='white'>
                        <Tooltip label='Home' bg="gray.500">
                            <HomeIcon fontSize='large' _hover={{bg: "red"}}/>
                        </Tooltip>
                    
                    </Box>
                </Link>

            </Box>
            <Box>
                <Divider orientation="horizontal"/>
            </Box>
            <Box display="flex" color='white' justifyContent='center' paddingTop='1rem' paddingBottom='1rem'>
                <Toggle />
            </Box>
            {/* <Box display="flex" color='white' justifyContent='center' paddingTop='2rem' paddingBottom='2rem'>
                <Tooltip label='SimplyNex' bg="gray.500">
                    <Avatar shadow='sm' size='lg' src='https://64.media.tumblr.com/073578da50f557bd56caef112e255950/b754da231bb4bd69-34/s640x960/4f8c9cf93d4f03c42d448eba0dac2a9cbb2a69e2.jpg'/>
                </Tooltip>
            </Box> */}
            

        </Flex>
        </main>
    )
}

export default Navbar
