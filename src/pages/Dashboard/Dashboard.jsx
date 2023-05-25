import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import {
  Box,
  useDisclosure,
  Flex,
  Text,
  Image,
  useColorModeValue,
  Input,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  SkeletonCircle,
  IconButton,
  AvatarBadge,
  SkeletonText,
  Divider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  MenuGroup,
  Card,
  CardBody
} from '@chakra-ui/react';
import swal from 'sweetalert';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  CustomerCountCard,
  EstimateRequestCountCard,
  MonthlyRevenueCard,
  EstimateCountCard,
  QuoteRequestRecentTable,
  QuoteRecentTable,
  InvoiceRecentTable,
  CustomerRecentTable,
  NewQRStat,
  OverdueInvoicesStat,
  PendingQuotesStat,
  TotalCustomersStat,
  MonthlyRevenueStat,
  YearlyRevenueStat,
  MonthlyRevenueLineGraph
} from '../../components';
import { FiActivity, FiBarChart2, FiSearch, FiBell, FiX } from 'react-icons/fi';
import { BsChevronDown } from 'react-icons/bs';
import { faker } from '@faker-js/faker';
import supabase from '../../utils/supabaseClient';
import { LogOut, Settings, User } from 'lucide-react';

// export const data = {
//   labels,
//   datasets: [
//     {
//       label: "2021",
//       data: labels.map(() => faker.datatype.number({ min: 0, max: 20000 })),
//       borderColor: "rgb(255, 99, 132)",
//       backgroundColor: "rgba(255, 99, 132, 0.5)",
//     },
//     {
//       label: "2022",
//       data: labels.map(() => faker.datatype.number({ min: 0, max: 20000 })),
//       borderColor: "rgb(53, 162, 235)",
//       backgroundColor: "rgba(53, 162, 235, 0.5)",
//     }
//   ],
// };

const Dashboard = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  // console.log(auth.user.user_metadata.avatar_url)
  const [loggedInUserData, setloggedInUserData] = useState('');
  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();

  //Luxon date to make it easier to query conditions using date for DB
  const date = DateTime.local();
  const startOfWeek = DateTime.local().startOf('week').toJSDate();
  const endOfWeek = DateTime.local().endOf('week').toJSDate();
  const currentYear = DateTime.local().year;
  const lastYear = currentYear - 1;
  const twoYearsAgo = currentYear - 2;
  const currentMonthAcronym = date.toFormat('MMM');

  //React states
  const [monthlyGraphRevenueDataSet01, setMonthlyGraphRevenueDataSet01] = useState('');
  const [monthlyGraphRevenueDataSet02, setMonthlyGraphRevenueDataSet02] = useState('');
  const [monthlyGraphRevenueDataSet03, setMonthlyGraphRevenueDataSet03] = useState('');
  const [currentMonthRevenuesWithPercentageChange, setCurrentMonthRevenuesWithPercentageChange] =
    useState('');
  const [
    currentYearTotalRevenueWithPercentageChange,
    setCurrentYearTotalRevenueWithPercentageChange
  ] = useState('');
  const [quoteRequestsRecentData, setQuoteRequestsRecentData] = useState('');
  const [quotesRecentData, setQuotesRecentData] = useState('');
  const [customerRecentData, setCustomerRecentData] = useState('');
  const [invoiceRecentData, setInvoiceRecentData] = useState('');
  const [overdueInvoicesCount, setoverdueInvoicesCount] = useState('');
  const [newQRRequestCount, setNewQRRequestCount] = useState('');
  const [pendingQuotesCount, setPendingQuotesCount] = useState('');
  const [totalCustomersCount, setTotalCustomersCount] = useState('');

  useEffect(() => {
    // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
    // if (!localStorage.getItem('supabase.auth.token')) {
    //     history.push('/login');
    // }
    // console.log(localStorage.getItem('supabase.auth.token'))
    userData();
    getRecentQR();
    invoicesOverDueCount();
    qrRequestNewCount();
    quotesPendingCount();
    totalCustomers();
    getRecentQuotes();
    getRecentCustomer();
    getRecentInvoices();
    getMonthlyRevenues();
    getMonthlyRevenues02();
    getMonthlyRevenues03();
    getCurrentMonthRevenuesWithPercentageChange();
    getCurrentYearTotalRevenueWithPercentageChange();
    console.log(auth.user);
  }, []);

  const logout = () => {
    // localStorage.clear();
    auth.signOut();
    swal('Logged Out!', 'You are now logged out from the system!', 'success');
    navigate('/login');
  };

  const userData = async () => {
    setloggedInUserData(auth.user.user_metadata);
    console.log(loggedInUserData);
    console.log(bg);
  };

  // Handles getting a count of all invoice with Overdue Status
  const invoicesOverDueCount = async () => {
    // const count = await supabase.sql`
    //     SELECT COUNT(*)
    //     FROM invoice
    //     WHERE status = 1 AND created_at BETWEEN ${startOfWeek} AND ${endOfWeek}
    // `
    const { count } = await supabase
      .from('invoice')
      .select('*', { count: 'exact' })
      .eq('invoice_status_id', 3);

    setoverdueInvoicesCount(count);
  };

  // Handles getting a count of all quote requests with a New Status
  const qrRequestNewCount = async () => {
    const { count } = await supabase
      .from('quote_request')
      .select('*', { count: 'exact' })
      .eq('est_request_status_id', 1);

    setNewQRRequestCount(count);
  };

  // Handles getting a count of all quotes with a Pending Status
  const quotesPendingCount = async () => {
    const { count } = await supabase
      .from('quote')
      .select('*', { count: 'exact' })
      .eq('status_id', 2);

    setPendingQuotesCount(count);
  };

  // Handles getting a count of all customers registed in DB
  const totalCustomers = async () => {
    const { count } = await supabase.from('customer').select('*', { count: 'exact' });

    setTotalCustomersCount(count);
  };

  // Handles getting the recent Quote Request from DB
  const getRecentQR = async () => {
    const { data, error } = await supabase
      .from('quote_request')
      .select('*, estimate_request_status:est_request_status_id(*), services:service_type_id(*)')
      .order('updated_at', { ascending: false })
      .limit(4);

    if (error) {
      console.log(error);
    }
    setQuoteRequestsRecentData(data);
  };

  // Handles getting the recent Quotes from DB
  const getRecentQuotes = async () => {
    const { data, error } = await supabase
      .from('quote')
      .select('*, customer:customer_id(*), quote_status:status_id(*), services:service_id(*)')
      .order('updated_at', { ascending: false })
      .limit(4);

    if (error) {
      console.log(error);
    }
    setQuotesRecentData(data);
  };

  // Handles getting the recent Customers from DB
  const getRecentCustomer = async () => {
    const { data, error } = await supabase
      .from('customer')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(4);

    if (error) {
      console.log(error);
    }
    setCustomerRecentData(data);
  };

  // Handles getting the recent Invoices from DB
  const getRecentInvoices = async () => {
    const { data, error } = await supabase
      .from('invoice')
      .select(
        '*, customer:customer_id(*), invoice_status:invoice_status_id(*), service_type:service_type_id(*)'
      )
      .order('updated_at', { ascending: false })
      .limit(4);

    if (error) {
      console.log(error);
    }
    setInvoiceRecentData(data);
    // console.log(invoiceRecentData);
  };

  // Handles getting Monthly Revenue Stat from DB to display in Chart.js for current year
  const getMonthlyRevenues = async () => {
    const { data, error } = await supabase.rpc('get_monthly_invoice_revenue_dataset', {
      year_input: currentYear
    });

    if (error) {
      console.log(error);
    }
    setMonthlyGraphRevenueDataSet01(data);
    // console.log(data)
  };

  // Handles getting Monthly Revenue Stat from DB to display in Chart.js for last year
  const getMonthlyRevenues02 = async () => {
    const { data, error } = await supabase.rpc('get_monthly_invoice_revenue_dataset', {
      year_input: lastYear
    });

    if (error) {
      console.log(error);
    }
    setMonthlyGraphRevenueDataSet02(data);
    // console.log(data)
  };

  // Handles getting Monthly Revenue Stat from DB to display in Chart.js for two years ago
  const getMonthlyRevenues03 = async () => {
    const { data, error } = await supabase.rpc('get_monthly_invoice_revenue_dataset', {
      year_input: twoYearsAgo
    });

    if (error) {
      console.log(error);
    }
    setMonthlyGraphRevenueDataSet03(data);
    // console.log(data)
  };

  // Handles getting Monthly Revenue with Percentage Change Stat
  const getCurrentMonthRevenuesWithPercentageChange = async () => {
    const { data, error } = await supabase.rpc('get_current_month_revenue_with_percentage_change');

    if (error) {
      console.log(error);
    }
    setCurrentMonthRevenuesWithPercentageChange(data[0]);
    // console.log(currentMonthRevenuesWithPercentageChange)
  };

  // Handles getting the current year total revenue percentage change Stat
  const getCurrentYearTotalRevenueWithPercentageChange = async () => {
    const { data, error } = await supabase.rpc(
      'get_current_year_total_revenue_with_percent_change'
    );

    if (error) {
      console.log(error);
    }
    setCurrentYearTotalRevenueWithPercentageChange(data[0]);
    console.log(data[0]);
  };

  return (
    <>
      <Flex flexDir="column" px={{ base: '1rem', lg: '1rem' }} w={'full'} mt={'1rem'}>
        {/*  */}
        <Box display={{ base: 'none', lg: 'block' }}>
          <Card
            size="sm"
            rounded="lg"
            shadow={'none'}
            border={'1px'}
            borderColor={useColorModeValue('gray.200', 'gray.600')}>
            <CardBody>
              <Flex justifyContent={'space-between'}>
                {/* <Text>{loggedInUserData.email}</Text> */}
                <Box display={'flex'} alignItems={'center'}>
                  <IconButton
                    variant={'ghost'}
                    onClick={onSearchOpen}
                    aria-label="Search database"
                    icon={<FiSearch />}
                    size={'md'}
                  />
                </Box>
                <Flex>
                  <Flex alignItems={'center'}>
                    <Popover>
                      <PopoverTrigger>
                        <IconButton variant={'ghost'} icon={<FiBell />} mx={'10px'} size={'md'} />
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader fontWeight={'bold'}>
                          <Flex alignItems={'center'}>
                            <Icon as={FiBell} mr={'2'} />
                            Notifications
                          </Flex>
                        </PopoverHeader>
                        <PopoverBody display={'flex'} justifyContent={'center'}>
                          <Text>No Notification!</Text>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                    <Divider orientation="vertical" px={'10px'} mx={'1px'} />
                  </Flex>
                  <Menu>
                    <MenuButton
                      _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                      py={1}
                      px={2}
                      rounded="10">
                      <Flex flexDir={'row'} alignItems="center">
                        {loggedInUserData ? (
                          <Avatar size={'sm'} src={loggedInUserData.avatar_url} mr={'1rem'}>
                            <AvatarBadge boxSize="1.25em" bg="green.500" />
                          </Avatar>
                        ) : (
                          <SkeletonCircle size="10" />
                        )}
                        <Box w={'full'}>
                          {/* <Text ml={'10px'} fontSize={'16px'}>
                          Hi,
                        </Text> */}
                          <Text ml={'4px'} fontWeight={'medium'} fontSize={'12px'}>
                            {loggedInUserData ? (
                              loggedInUserData.full_name
                            ) : (
                              <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
                            )}
                          </Text>
                          <Text fontSize={'12px'} fontWeight="light">
                            {loggedInUserData.email}
                          </Text>
                        </Box>
                        <Icon as={BsChevronDown} mx={'10px'} />
                      </Flex>
                    </MenuButton>
                    <MenuList bg={useColorModeValue('white', 'gray.700')}>
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
                  </Menu>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
        </Box>
        <SimpleGrid
          spacing={4}
          columns={2}
          minChildWidth="170px"
          pb={'0rem'}
          pt={{ base: '2rem', lg: '1rem' }}>
          {/* Total New QR's Stat Card */}
          <NewQRStat newQRRequestCount={newQRRequestCount} />
          {/* Total Overdue Invoices Stat Card */}
          <OverdueInvoicesStat overdueInvoicesCount={overdueInvoicesCount} />
          {/* Total Pending Quotes Stat */}
          <PendingQuotesStat pendingQuotesCount={pendingQuotesCount} />
          {/* Total Customers Stat Card */}
          <TotalCustomersStat totalCustomersCount={totalCustomersCount} />
        </SimpleGrid>
        <SimpleGrid spacing={4} minChildWidth="170px" pb={'1rem'} pt={{ base: '2rem', lg: '1rem' }}>
          {/* Monthly Revenue Stat Card */}
          <MonthlyRevenueStat
            currentMonthRevenuesWithPercentageChange={currentMonthRevenuesWithPercentageChange}
            currentMonthAcronym={currentMonthAcronym}
            currentYear={currentYear}
          />
          {/* Yearly Revenue Stat Card */}
          <YearlyRevenueStat
            currentYearTotalRevenueWithPercentageChange={
              currentYearTotalRevenueWithPercentageChange
            }
            currentYear={currentYear}
          />
        </SimpleGrid>
        <SimpleGrid spacing={4} mb={'2rem'} minChildWidth={'420px'}>
          {/* Montly Revenue Line Graph Card */}
          <Card
            size="md"
            rounded="lg"
            shadow={'none'}
            border={'1px'}
            borderColor={useColorModeValue('gray.200', 'gray.600')}>
            <CardBody>
              <Flex alignItems={'center'} ml="8px" gap={3}>
                <Icon as={FiBarChart2} boxSize={6} />
                <Text fontSize="2xl" fontWeight={'bold'}>
                  Monthly Revenue
                </Text>
              </Flex>
              {/* Line Graph Component */}
              <MonthlyRevenueLineGraph
                currentYear={currentYear}
                lastYear={lastYear}
                twoYearsAgo={twoYearsAgo}
                monthlyGraphRevenueDataSet01={monthlyGraphRevenueDataSet01}
                monthlyGraphRevenueDataSet02={monthlyGraphRevenueDataSet02}
                monthlyGraphRevenueDataSet03={monthlyGraphRevenueDataSet03}
              />
            </CardBody>
          </Card>
          {/* Recent Activity Card */}
          <Card
            size="md"
            rounded="lg"
            shadow={'none'}
            border={'1px'}
            borderColor={useColorModeValue('gray.200', 'gray.600')}>
            <CardBody>
              <Flex alignItems={'center'} mb={'1rem'} ml="8px">
                <Icon as={FiActivity} boxSize={6} />
                <Text ml={'1rem'} fontSize="2xl" fontWeight={'bold'}>
                  Recent Activity
                </Text>
              </Flex>
              {/* Tabs */}
              <Tabs variant={'line'}>
                <TabList>
                  <Tab>Quote Requests</Tab>
                  <Tab>Quotes</Tab>
                  <Tab>Invoices</Tab>
                  <Tab>Customers</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={2} pt={5}>
                    {/* Recent Quotes Request Updated Table */}
                    <QuoteRequestRecentTable data={quoteRequestsRecentData} />
                  </TabPanel>
                  <TabPanel px={2} pt={5}>
                    {/* Recent Quote Updated Table */}
                    <QuoteRecentTable data={quotesRecentData} />
                  </TabPanel>
                  <TabPanel px={2} pt={5}>
                    {/* Recent Invoice Updated Table */}
                    <InvoiceRecentTable data={invoiceRecentData} />
                  </TabPanel>
                  <TabPanel px={2} pt={5}>
                    {/* Recent Customer Updated Table */}
                    <CustomerRecentTable data={customerRecentData} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Flex>
      {/* Search Drawer for Global Search for future release */}
      <Drawer placement="top" onClose={onSearchClose} isOpen={isSearchOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <Flex>
              <Input variant="filled" placeholder="Search..." />
              <IconButton icon={<FiX />} ml={'1rem'} onClick={onSearchClose} />
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Dashboard;
