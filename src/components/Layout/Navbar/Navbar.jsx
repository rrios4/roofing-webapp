import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Text,
  Flex,
  Image,
  Avatar,
  Tooltip,
  VStack,
  useColorModeValue,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  IconButton,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  CloseButton,
  Icon
} from '@chakra-ui/react';
import Toggle from './Toggle';
import { Link, useNavigate } from 'react-router-dom';
import { FiUsers, FiInbox, FiGrid, FiFileText, FiMenu } from 'react-icons/fi';
import { TbRuler } from 'react-icons/tb';
import { useAuth } from '../../../hooks/useAuth';
import swal from 'sweetalert';

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  //Style for Card component
  const bg = useColorModeValue('white', 'gray.700');
  const buttonBackground = useColorModeValue('gray.100', 'gray.600');
  const tooltipBackground = useColorModeValue('gray.700', 'gray.100');
  const iconColors = useColorModeValue('#454947', 'white');
  const { isOpen: isNavOpen, onOpen: onNavOpen, onClose: onNavClose } = useDisclosure();

  const logout = () => {
    auth.signOut();
    swal('Logged Out!', 'You are now logged out from the system!', 'success');
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Navbar */}
      <Flex
        display={{ base: 'none', lg: 'flex' }}
        zIndex={'1'}
        position="fixed"
        w={{ base: 'full', lg: '6rem' }}
        h={{ base: '5rem', lg: '100vh' }}
        bg={bg}
        roundedTopRight={{ base: '0', lg: '0' }}
        roundedBottomRight={{ base: '0', lg: '0' }}
        flexDir={{ base: 'row', lg: 'column' }}
        shadow={'sm'}
        p="0"
        m="0"
        top={{ base: '0', lg: '0' }}
        borderRightWidth="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.600')}>
        <Link to="/">
          <Box display={'flex'} p="1rem" justifyContent={'center'} h={{ base: 'full', lg: 'auto' }}>
            <Box
              display="flex"
              flexDir={{ base: 'column', lg: 'column' }}
              h={{ base: 'full', lg: '4rem' }}
              bg={'blue.500'}
              shadow="sm"
              rounded="18"
              justifyContent={{ base: 'center', lg: 'center' }}
              px={{ base: '0px', lg: '0rem' }}
              _hover={{ bg: 'blue.600' }}>
              <Image
                p={{ base: '3px', lg: '4px' }}
                mx={{ base: 'auto', lg: 'auto' }}
                marginLeft={{ base: '0px', lg: '0' }}
                boxSize={{ base: '50px', lg: '90px' }}
                src="https://github.com/rrios4/roofing-webapp/blob/main/src/assets/LogoRR.png?raw=true"
              />
            </Box>
          </Box>
        </Link>
        <VStack display={{ base: 'none', lg: 'flex' }} spacing="6" color={'white'}>
          <Box
            display="flex"
            color="white"
            justifyContent="center"
            paddingTop="10px"
            paddingBottom="0px">
            {/* <Tooltip label="SimplyNex" bg="gray.500">
              <Avatar
                shadow="sm"
                size="md"
                src={
                  "https://64.media.tumblr.com/073578da50f557bd56caef112e255950/b754da231bb4bd69-34/s640x960/4f8c9cf93d4f03c42d448eba0dac2a9cbb2a69e2.jpg"
                }
              />
            </Tooltip> */}
          </Box>
          <Text color={'GrayText'} fontSize={'10px'} fontWeight={'bold'}>
            ANALYTICS
          </Text>
          <Link to={'/'}>
            <Tooltip label="Dashboard" bg={tooltipBackground}>
              <Box p={'1'} rounded="md" _hover={{ bg: buttonBackground }}>
                {/* <MdDashboard color={iconColors} size={"28px"} /> */}
                <FiGrid color={iconColors} size={'25px'} />
              </Box>
            </Tooltip>
          </Link>
          <Text color={'GrayText'} fontSize={'10px'} fontWeight={'bold'}>
            CONTENT
          </Text>
          <Link to={'/qr'}>
            <Tooltip label="Quote Requests" bg={tooltipBackground}>
              <Box p={'1'} rounded="md" _hover={{ bg: buttonBackground }}>
                {/* <MdScheduleSend size={'30px'}/> */}
                {/* <AiFillSchedule color={iconColors} size={"28px"} /> */}
                <FiInbox color={iconColors} size="25px" />
              </Box>
            </Tooltip>
          </Link>
          <Link to={'/invoices'}>
            <Tooltip label="Invoices" bg={tooltipBackground}>
              <Box p={'1'} rounded="md" _hover={{ bg: buttonBackground }}>
                {/* <MdRequestPage color={iconColors} size={"28px"} /> */}
                <FiFileText color={iconColors} size={'25px'} />
              </Box>
            </Tooltip>
          </Link>
          <Link to={'/quotes'}>
            <Tooltip label="Quotes" bg={tooltipBackground}>
              <Box p={'1'} rounded="md" _hover={{ bg: buttonBackground }}>
                {/* <MdSquareFoot color={iconColors} size={"28px"} /> */}
                <TbRuler color={iconColors} size={'25px'} />
              </Box>
            </Tooltip>
          </Link>
          <Link to={'/customers'}>
            <Tooltip label="Customers" bg={tooltipBackground}>
              <Box p={'1'} rounded="md" _hover={{ bg: buttonBackground }}>
                {/* <MdPeopleAlt color={iconColors} size={"28px"} /> */}
                <FiUsers color={iconColors} size={'25px'} />
              </Box>
            </Tooltip>
          </Link>
        </VStack>
        <Box
          display={{ base: 'none', lg: 'flex' }}
          justifyContent="center"
          marginTop={{ base: '0', lg: 'auto' }}
          marginLeft={{ base: 'auto', lg: '0' }}
          p="0rem">
          {/* <Link to='/'>
                    <Box _hover={{bg: "gray.600"}} rounded='md' p='8px' color='white'>
                        <Tooltip label='Home' bg="gray.500">
                            <HomeIcon fontSize='large' _hover={{bg: "red"}}/>
                        </Tooltip>
                    
                    </Box>
                </Link> */}
          <Box
            display={{ base: 'none', lg: 'flex' }}
            color="white"
            justifyContent="center"
            paddingTop="1rem"
            paddingBottom="1rem">
            <Toggle />
          </Box>
        </Box>
      </Flex>

      {/* Mobile Navbar */}
      <Flex
        display={{ base: 'flex', lg: 'none' }}
        w="full"
        alignItems={'center'}
        px="4"
        bg={bg}
        position="fixed"
        h="5rem"
        zIndex={'1'}
        justifyContent="space-between"
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.600')}
        backdropBlur={'md'}>
        <Flex alignItems={'center'}>
          <IconButton
            onClick={onNavOpen}
            variant="solid"
            aria-label="open menu"
            icon={<FiMenu />}
          />

          <Link to={'/'}>
            <Box bg={'blue.500'} rounded="18" _hover={{ bg: 'blue.600' }} shadow="sm" mx={'1rem'}>
              <Image
                p={{ base: '2px', lg: '4px' }}
                boxSize={{ base: '50px', lg: '90px' }}
                src="https://github.com/rrios4/roofing-webapp/blob/main/src/assets/LogoRR.png?raw=true"
              />
            </Box>
          </Link>
        </Flex>

        <HStack spacing={'0'} gap={2}>
          <Toggle />
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                <HStack>
                  <Avatar
                    bg={'gray.400'}
                    size={'sm'}
                    src={auth.user ? auth.user.user_metadata.avatar_url : ''}
                  />
                </HStack>
              </MenuButton>
              {auth.user ? (
                <MenuList>
                  <MenuItem>Profile</MenuItem>
                  <MenuItem>Settings</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={logout}>Sign out</MenuItem>
                </MenuList>
              ) : (
                <MenuList bg={bg}>
                  <Link to={'/login'}>
                    <MenuItem>Sign In</MenuItem>
                  </Link>
                </MenuList>
              )}
            </Menu>
          </Flex>
        </HStack>
      </Flex>
      <Drawer placement="left" size={'full'} isOpen={isNavOpen} onClose={onNavClose}>
        <DrawerOverlay />
        <DrawerContent>
          <Box transition={'3s ease'} bg={bg} w={'full'} pos={'fixed'} h="full" pt={'1rem'}>
            <Flex h={20} alignItems="center" mx={8} justifyContent={'space-between'}>
              <Box bg={'blue.500'} rounded="18" _hover={{ bg: 'blue.600' }} shadow="sm" mx={'1rem'}>
                <Image
                  p={{ base: '2px', lg: '4px' }}
                  boxSize={{ base: '50px', lg: '90px' }}
                  src="https://github.com/rrios4/roofing-webapp/blob/main/src/assets/LogoRR.png?raw=true"
                />
              </Box>
              <CloseButton display={'flex'} onClick={onNavClose} />
            </Flex>
            <Flex mx={8}>
              <Box w={'full'} py={'1rem'}>
                <Link to={'/'}>
                  <Flex
                    align={'center'}
                    p="4"
                    mx={4}
                    borderRadius={'lg'}
                    cursor={'pointer'}
                    _hover={{ bg: 'blue.400', color: 'white' }}
                    onClick={onNavClose}>
                    <Icon mr={4} fontSize="20" _groupHover={{ color: 'white' }} as={FiGrid} />
                    Dashboard
                  </Flex>
                </Link>
                <Link to={'/qr'}>
                  <Flex
                    align={'center'}
                    p="4"
                    mx={4}
                    borderRadius={'lg'}
                    cursor={'pointer'}
                    _hover={{ bg: 'blue.400', color: 'white' }}
                    onClick={onNavClose}>
                    <Icon mr={4} fontSize="20" _groupHover={{ color: 'white' }} as={FiInbox} />
                    Quote Requests
                  </Flex>
                </Link>
                <Link to={'/invoices'}>
                  <Flex
                    align={'center'}
                    p="4"
                    mx={4}
                    borderRadius={'lg'}
                    cursor={'pointer'}
                    _hover={{ bg: 'blue.400', color: 'white' }}
                    onClick={onNavClose}>
                    <Icon mr={4} fontSize="20" _groupHover={{ color: 'white' }} as={FiFileText} />
                    Invoices
                  </Flex>
                </Link>
                <Link to={'/quotes'}>
                  <Flex
                    align={'center'}
                    p="4"
                    mx={4}
                    borderRadius={'lg'}
                    cursor={'pointer'}
                    _hover={{ bg: 'blue.400', color: 'white' }}
                    onClick={onNavClose}>
                    <Icon mr={4} fontSize="20" _groupHover={{ color: 'white' }} as={TbRuler} />
                    Quotes
                  </Flex>
                </Link>
                <Link to={'/customers'}>
                  <Flex
                    align={'center'}
                    p="4"
                    mx={4}
                    borderRadius={'lg'}
                    cursor={'pointer'}
                    _hover={{ bg: 'blue.400', color: 'white' }}
                    onClick={onNavClose}>
                    <Icon mr={4} fontSize="20" _groupHover={{ color: 'white' }} as={FiUsers} />
                    Customers
                  </Flex>
                </Link>
              </Box>
            </Flex>
          </Box>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
