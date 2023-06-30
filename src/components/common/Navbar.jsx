import React, { useEffect, useState, useContext } from 'react';
import {
  NewEstimateRequestForm,
  NewInvoiceForm,
  CreateQuoteForm,
  NewCustomerForm
} from '../index.js';
import { useFetchAllQRStatuses } from '../../hooks/useAPI/useQRStatuses.jsx';
import { useFetchQuotes } from '../../hooks/useAPI/useQuotes.jsx';
import { useQuoteStatuses } from '../../hooks/useAPI/useQuoteStatuses.jsx';
import { useFetchAllInvoices } from '../../hooks/useAPI/useInvoices.jsx';
import { useFetchAllInvoiceStatuses } from '../../hooks/useAPI/useInvoiceStatuses.jsx';
import { useFetchAllServices } from '../../hooks/useAPI/useServices.jsx';
import { useFetchAllCustomerTypes } from '../../hooks/useAPI/useCustomerTypes.jsx';
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
  Icon,
  MenuGroup,
  Grid,
  GridItem,
  Popover,
  useToast,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  Button
} from '@chakra-ui/react';
import Toggle from './Toggle';
import { Link, useNavigate } from 'react-router-dom';
import { FiUsers, FiInbox, FiGrid, FiFileText, FiMenu } from 'react-icons/fi';
import { TbRuler } from 'react-icons/tb';
import { useAuth } from '../../hooks/useAuth';
import swal from 'sweetalert';
import { LeafyGreen, LogIn, LogOut, Plus, Settings, User } from 'lucide-react';

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  //Style for Card component
  const bg = useColorModeValue('white', 'gray.700');
  const buttonBackground = useColorModeValue('gray.100', 'gray.600');
  const tooltipBackground = useColorModeValue('gray.700', 'gray.100');
  const iconColors = useColorModeValue('#454947', 'white');
  const { isOpen: isNavOpen, onOpen: onNavOpen, onClose: onNavClose } = useDisclosure();

  const toast = useToast();
  const initialRef = React.useRef();

  const { isOpen: leadIsNewOpen, onOpen: leadOnNewOpen, onClose: leadOnNewClose } = useDisclosure();
  const {
    isOpen: invoiceIsNewOpen,
    onOpen: invoiceOnNewOpen,
    onClose: invoiceOnNewClose
  } = useDisclosure();
  const {
    isOpen: quoteIsNewOpen,
    onOpen: quoteOnNewOpen,
    onClose: quoteOnNewClose
  } = useDisclosure();
  const {
    isOpen: customerIsNewOpen,
    onOpen: customerOnNewOpen,
    onClose: customerOnNewClose
  } = useDisclosure();

  // leads
  const { data: qrStatuses } = useFetchAllQRStatuses();

  //invoices
  const {
    data: invoices,
    isLoading: isInvoicesLoading,
    isError: isInvoicesError
  } = useFetchAllInvoices();
  const {
    data: invoiceStatuses,
    isLoading: isInvoiceStatuses,
    isError: isInvoicesStatusesError
  } = useFetchAllInvoiceStatuses();
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState('');

  //quotes
  const { quotes, isLoading: quotesLoadingStateIsOn, isError } = useFetchQuotes();
  const { data: services, isLoading: isRoofingServicesLoading } = useFetchAllServices();
  const { quoteStatuses } = useQuoteStatuses();

  //customers
  const { data: customerTypes } = useFetchAllCustomerTypes();

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
        shadow={'xs'}
        p="0"
        m="0"
        top={{ base: '0', lg: '0' }}
        borderRightWidth="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.700')}>
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
                src="/assets/LogoRR.png"
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
            paddingBottom="0px"></Box>
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
          <Link to={'/leads'}>
            <Tooltip label="Leads" bg={tooltipBackground}>
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
        <Box
          justifyContent={'center'}
          display={{ base: 'none', lg: 'flex' }}
          marginBottom={'1rem'}
          position="relative">
          {auth?.user && (
            <>
              <Popover placement="top-start">
                <PopoverTrigger>
                  <Box /* circle */
                    cursor={'pointer'}
                    positon="absolute"
                    top="50%"
                    left="50%"
                    transform="translate (-50%, -50%)"
                    width="40px"
                    height="40px"
                    borderRadius="50%"
                    bg="blue.500"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    _hover={{ bg: 'blue.600' }}>
                    <Tooltip placement="right" label="New" bg={tooltipBackground} offset={[0, 15]}>
                      <Box rounded="md">
                        <Plus color={'white'} size={'20px'} />
                      </Box>
                    </Tooltip>
                  </Box>
                </PopoverTrigger>
                <PopoverContent w="full" _focus={{ outline: 'none', boxShadow: 'none' }}>
                  <PopoverBody>
                    <Grid templateColumns={'repeat(2, 1fr)'} gap={'3'}>
                      <GridItem>
                        <Button
                          onClick={leadOnNewOpen}
                          p="4"
                          rounded="md"
                          width="100%"
                          height="100%"
                          bg="bg"
                          _hover={{ bg: buttonBackground }}>
                          <Flex flexDir={'column'} rounded="md" gap={2} w={'full'}>
                            <Flex gap={2}>
                              <FiInbox color={iconColors} size={'25px'} />
                              <Text fontWeight="600" my={'auto'} fontSize={'16px'}>
                                Lead
                              </Text>
                            </Flex>
                            <Text fontWeight={300} fontSize={'14px'} textAlign={'left'}>
                              Shortcut to add a new lead
                            </Text>
                          </Flex>
                        </Button>
                        <NewEstimateRequestForm
                          isOpen={leadIsNewOpen}
                          onClose={leadOnNewClose}
                          initialRef={initialRef}
                          toast={toast}
                          services={services}
                          qrStatuses={qrStatuses}
                          customerTypes={customerTypes}
                        />
                      </GridItem>
                      <GridItem>
                        <Button
                          onClick={invoiceOnNewOpen}
                          p="4"
                          rounded="md"
                          width="100%"
                          height="100%"
                          bg="bg"
                          _hover={{ bg: buttonBackground }}>
                          <Flex flexDir={'column'} rounded="md" gap={2} w={'full'}>
                            <Flex gap={2}>
                              <FiFileText color={iconColors} size={'25px'} />
                              <Text fontWeight="600" my={'auto'} fontSize={'16px'}>
                                Invoice
                              </Text>
                            </Flex>
                            <Text fontWeight={300} fontSize={'14px'} textAlign={'left'}>
                              Shortcut to add a new invoice
                            </Text>
                          </Flex>
                        </Button>
                        <NewInvoiceForm
                          initialRef={initialRef}
                          isNewOpen={invoiceIsNewOpen}
                          onNewClose={invoiceOnNewClose}
                          onNewOpen={invoiceOnNewOpen}
                          toast={toast}
                          data={invoices}
                          nextInvoiceNumberValue={nextInvoiceNumber}
                          loadingState={isInvoicesLoading}
                          services={services}
                          invoiceStatuses={invoiceStatuses}
                        />
                      </GridItem>
                      <GridItem>
                        <Button
                          onClick={quoteOnNewOpen}
                          p="4"
                          rounded="md"
                          width="100%"
                          height="100%"
                          bg="bg"
                          _hover={{ bg: buttonBackground }}>
                          <Flex flexDir={'column'} rounded="md" gap={2} w={'full'}>
                            <Flex gap={2}>
                              <TbRuler color={iconColors} size={'25px'} />
                              <Text fontWeight="600" my={'auto'} fontSize={'16px'}>
                                Quote
                              </Text>
                            </Flex>
                            <Text fontWeight={300} fontSize={'14px'} textAlign={'left'}>
                              Shortcut to add a new quote
                            </Text>
                          </Flex>
                        </Button>
                        <CreateQuoteForm
                          isOpen={quoteIsNewOpen}
                          onClose={quoteOnNewClose}
                          initialRef={initialRef}
                          services={services}
                          quoteStatuses={quoteStatuses}
                          toast={toast}
                          data={quotes}
                        />
                      </GridItem>
                      <GridItem>
                        <Button
                          onClick={customerOnNewOpen}
                          p="4"
                          rounded="md"
                          width="100%"
                          height="100%"
                          bg="bg"
                          _hover={{ bg: buttonBackground }}>
                          <Flex flexDir={'column'} rounded="md" gap={2}>
                            <Flex gap={2}>
                              <FiUsers color={iconColors} size={'25px'} />
                              <Text fontWeight="600" my={'auto'} fontSize={'16px'}>
                                Customer
                              </Text>
                            </Flex>
                            <Text fontWeight={300} fontSize={'14px'}>
                              Shortcut to add a new customer
                            </Text>
                          </Flex>
                        </Button>
                        <NewCustomerForm
                          isOpen={customerIsNewOpen}
                          onClose={customerOnNewClose}
                          initialRef={initialRef}
                          toast={toast}
                          customerTypes={customerTypes}
                        />
                      </GridItem>
                    </Grid>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </>
          )}
        </Box>
      </Flex>

      {/*
      {isFormOpen && (
        <NewCustomerForm               
          onClose={toggleFormVisibility}
          initialRef={initialRef}
          toast={toast}
          customerTypes={customerTypes}
        />)}
      */}

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
          <Link to={'/'}>
            <Box bg={'blue.500'} rounded="xl" _hover={{ bg: 'blue.500' }} shadow="sm" mx={'1rem'}>
              <Image
                p={{ base: '2px', lg: '4px' }}
                boxSize={{ base: '45px', lg: '90px' }}
                src="/LogoRR.png"
              />
            </Box>
          </Link>
        </Flex>

        <HStack spacing={'0'} gap={1}>
          {auth?.user && (
            <>
              {/*add plus symbol*/}
              <Flex pr={2}>
                <Popover placement="bottom-start">
                  <PopoverTrigger>
                    <Box /* circle */
                      cursor={'pointer'}
                      positon="absolute"
                      top="50%"
                      left="50%"
                      transform="translate (-50%, -50%)"
                      width="32px"
                      height="32px"
                      borderRadius="50%"
                      bg="blue.500"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      _hover={{ bg: 'blue.600' }}>
                      <Box rounded="md">
                        <Plus color={'white'} size={'16px'} />
                      </Box>
                    </Box>
                  </PopoverTrigger>
                  <PopoverContent
                    position="relative"
                    top="5px"
                    left="-7.5%"
                    w="100%"
                    _focus={{ outline: 'none', boxShadow: 'none' }}>
                    <PopoverBody>
                      <Grid templateColumns={'repeat(2, 1fr)'} gap={'3'}>
                        <GridItem>
                          <Button
                            onClick={leadOnNewOpen}
                            p="4"
                            rounded="md"
                            width="100%"
                            height="100%"
                            bg="bg"
                            _hover={{ bg: buttonBackground }}>
                            <Flex flexDir={'column'} rounded="md" gap={2} w={'full'}>
                              <Flex gap={2}>
                                <FiInbox color={iconColors} size={'25px'} />
                                <Text fontWeight="600" my={'auto'} fontSize={'16px'}>
                                  Lead
                                </Text>
                              </Flex>
                              <Text fontWeight={300} fontSize={'14px'} textAlign={'left'}>
                                Shortcut to add a new lead
                              </Text>
                            </Flex>
                          </Button>
                          <NewEstimateRequestForm
                            isOpen={leadIsNewOpen}
                            onClose={leadOnNewClose}
                            initialRef={initialRef}
                            toast={toast}
                            services={services}
                            qrStatuses={qrStatuses}
                            customerTypes={customerTypes}
                          />
                        </GridItem>
                        <GridItem>
                          <Button
                            onClick={invoiceOnNewOpen}
                            p="4"
                            rounded="md"
                            width="100%"
                            height="100%"
                            bg="bg"
                            _hover={{ bg: buttonBackground }}>
                            <Flex flexDir={'column'} rounded="md" gap={2} w={'full'}>
                              <Flex gap={2}>
                                <FiFileText color={iconColors} size={'25px'} />
                                <Text fontWeight="600" my={'auto'} fontSize={'16px'}>
                                  Invoice
                                </Text>
                              </Flex>
                              <Text fontWeight={300} fontSize={'14px'} textAlign={'left'}>
                                Shortcut to add a new invoice
                              </Text>
                            </Flex>
                          </Button>
                          <NewInvoiceForm
                            initialRef={initialRef}
                            isNewOpen={invoiceIsNewOpen}
                            onNewClose={invoiceOnNewClose}
                            onNewOpen={invoiceOnNewOpen}
                            toast={toast}
                            data={invoices}
                            nextInvoiceNumberValue={nextInvoiceNumber}
                            loadingState={isInvoicesLoading}
                            services={services}
                            invoiceStatuses={invoiceStatuses}
                          />
                        </GridItem>
                        <GridItem>
                          <Button
                            onClick={quoteOnNewOpen}
                            p="4"
                            rounded="md"
                            width="100%"
                            height="100%"
                            bg="bg"
                            _hover={{ bg: buttonBackground }}>
                            <Flex flexDir={'column'} rounded="md" gap={2} w={'full'}>
                              <Flex gap={2}>
                                <TbRuler color={iconColors} size={'25px'} />
                                <Text fontWeight="600" my={'auto'} fontSize={'16px'}>
                                  Quote
                                </Text>
                              </Flex>
                              <Text fontWeight={300} fontSize={'14px'} textAlign={'left'}>
                                Shortcut to add a new quote
                              </Text>
                            </Flex>
                          </Button>
                          <CreateQuoteForm
                            isOpen={quoteIsNewOpen}
                            onClose={quoteOnNewClose}
                            initialRef={initialRef}
                            services={services}
                            quoteStatuses={quoteStatuses}
                            toast={toast}
                            data={quotes}
                          />
                        </GridItem>
                        <GridItem>
                          <Button
                            onClick={customerOnNewOpen}
                            p="4"
                            rounded="md"
                            width="100%"
                            height="100%"
                            bg="bg"
                            _hover={{ bg: buttonBackground }}>
                            <Flex flexDir={'column'} rounded="md" gap={2}>
                              <Flex gap={2}>
                                <FiUsers color={iconColors} size={'25px'} />
                                <Text fontWeight="600" my={'auto'} fontSize={'16px'}>
                                  Customer
                                </Text>
                              </Flex>
                              <Text fontWeight={300} fontSize={'14px'}>
                                Shortcut to add a new customer
                              </Text>
                            </Flex>
                          </Button>
                          <NewCustomerForm
                            isOpen={customerIsNewOpen}
                            onClose={customerOnNewClose}
                            initialRef={initialRef}
                            toast={toast}
                            customerTypes={customerTypes}
                          />
                        </GridItem>
                      </Grid>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Flex>
            </>
          )}

          <Flex alignItems={'center'} pr={4}>
            <Menu>
              <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                <HStack>
                  <Avatar
                    w={'32px'}
                    h={'32px'}
                    bg={'gray.400'}
                    src={auth.user ? auth.user.user_metadata.avatar_url : ''}
                  />
                </HStack>
              </MenuButton>
              {auth.user ? (
                <MenuList>
                  <MenuGroup title="My Account" icon={<User />}>
                    <MenuItem flexDir={'row'} gap={'2'}>
                      <User size={'15px'} />
                      <Text>Profile</Text>
                    </MenuItem>
                    <MenuItem flexDir={'row'} gap={'2'}>
                      <Settings size={'15px'} />
                      <Text>Settings</Text>
                    </MenuItem>
                  </MenuGroup>
                  <MenuDivider />
                  <MenuGroup>
                    <MenuItem onClick={logout} flexDir={'row'} gap={'2'}>
                      <LogOut size={'15px'} />
                      <Text>Sign Out</Text>
                    </MenuItem>
                  </MenuGroup>
                </MenuList>
              ) : (
                <MenuList>
                  <MenuGroup title="My Account" icon={<User size={'15px'} />}>
                    <Link to={'/login'}>
                      <MenuItem flexDir={'row'} gap={'2'}>
                        <LogIn size={'15px'} />
                        {/* <LogOut size={'15px'} /> */}
                        <Text>Login</Text>
                      </MenuItem>
                    </Link>
                  </MenuGroup>
                </MenuList>
              )}
            </Menu>
          </Flex>
          <IconButton
            size={'md'}
            onClick={onNavOpen}
            variant="solid"
            aria-label="open menu"
            icon={<FiMenu />}
          />
        </HStack>
      </Flex>
      <Drawer placement="right" size={'full'} isOpen={isNavOpen} onClose={onNavClose}>
        <DrawerOverlay />
        <DrawerContent>
          <Box transition={'3s ease'} bg={bg} w={'full'} pos={'fixed'} h="full" pt={'1rem'}>
            <Flex h={20} alignItems="center" mx={8} justifyContent={'space-between'}>
              <Flex>
                <Box
                  bg={'blue.500'}
                  rounded="xl"
                  _hover={{ bg: 'blue.600' }}
                  shadow="sm"
                  mx={'1rem'}>
                  <Image
                    p={{ base: '2px', lg: '4px' }}
                    boxSize={{ base: '50px', lg: '90px' }}
                    src="/LogoRR.png"
                  />
                </Box>
                <Text my={'auto'} fontSize={'xl'} fontWeight={600}>
                  The Roofing App
                </Text>
              </Flex>
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
                <Link to={'/leads'}>
                  <Flex
                    align={'center'}
                    p="4"
                    mx={4}
                    borderRadius={'lg'}
                    cursor={'pointer'}
                    _hover={{ bg: 'blue.400', color: 'white' }}
                    onClick={onNavClose}>
                    <Icon mr={4} fontSize="20" _groupHover={{ color: 'white' }} as={FiInbox} />
                    Leads
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
                <Flex mx={'3'}>
                  <Toggle />
                  {/*<Text align="center" p="3" mx='-3'> Toggle Dark Mode </Text>*/}
                </Flex>
              </Box>
            </Flex>
          </Box>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
