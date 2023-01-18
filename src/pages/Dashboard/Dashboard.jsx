import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import {
  Box,
  useDisclosure,
  Flex,
  Text,
  Grid,
  Button,
  Image,
  VStack,
  HStack,
  Stack,
  Badge,
  useColorModeValue,
  Input,
  SimpleGrid,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Stat,
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
  DrawerCloseButton,
  DrawerBody,
  DrawerHeader,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Skeleton,
} from "@chakra-ui/react";
import swal from "sweetalert";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth";
import {
  FcRuler,
  FcMoneyTransfer,
  FcConferenceCall,
  FcDepartment,
  FcGallery,
} from "react-icons/fc";
import {
  Card,
  CustomerCountCard,
  EstimateRequestCountCard,
  MonthlyRevenueCard,
  EstimateCountCard,
} from "../../components";
import {
  MdKeyboardArrowLeft,
  MdPostAdd,
  MdSearch,
  MdKeyboardArrowRight,
  MdEdit,
  MdDelete,
  MdFilterList,
  MdFilterAlt,
  MdToday,
} from "react-icons/md";
import {
  FiActivity,
  FiBarChart2,
  FiUsers,
  FiInbox,
  FiGrid,
  FiFileText,
  FiMenu,
  FiCreditCard,
  FiDollarSign,
  FiSearch,
  FiArrowDown,
  FiBell,
  FiX,
} from "react-icons/fi";
import { BsChevronDown } from "react-icons/bs";
import { faker } from "@faker-js/faker";
import { TbRuler } from "react-icons/tb";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import supabase from "../../utils/supabaseClient";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "Monthly Revenue",
    },
  },
};

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  // console.log(auth.user.user_metadata.avatar_url)
  const [loggedInUserData, setloggedInUserData] = useState("");
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();

  //Luxon date to make it easier to query conditions using date for DB
  const startOfWeek = DateTime.local().startOf("week").toJSDate();
  const endOfWeek = DateTime.local().endOf("week").toJSDate();
  const currentYear = DateTime.local().year;
  const lastYear = currentYear - 1;
  const twoYearsAgo = currentYear - 2;

  //React states
  const [monthlyGraphRevenueDataSet01, setMonthlyGraphRevenueDataSet01] = useState('');
  const [monthlyGraphRevenueDataSet02, setMonthlyGraphRevenueDataSet02] = useState('');
  const [monthlyGraphRevenueDataSet03, setMonthlyGraphRevenueDataSet03] = useState('');
  const [quoteRequestsRecentData, setQuoteRequestsRecentData] = useState("");
  const [quotesRecentData, setQuotesRecentData] = useState("");
  const [customerRecentData, setCustomerRecentData] = useState("");
  const [invoiceRecentData, setInvoiceRecentData] = useState("");
  const [overdueInvoicesCount, setoverdueInvoicesCount] = useState("");
  const [newQRRequestCount, setNewQRRequestCount] = useState("");
  const [pendingQuotesCount, setPendingQuotesCount] = useState("");
  const [totalCustomersCount, setTotalCustomersCount] = useState("");

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
  }, []);

  const logout = () => {
    // localStorage.clear();
    auth.Logout();
    swal("Logged Out!", "You are now logged out from the system!", "success");
    navigate("/login");
  };

  const userData = async () => {
    setloggedInUserData(auth.user.user_metadata);
    console.log(loggedInUserData);
    console.log(bg);
  };

  const invoicesOverDueCount = async () => {
    // const count = await supabase.sql`
    //     SELECT COUNT(*)
    //     FROM invoice
    //     WHERE status = 1 AND created_at BETWEEN ${startOfWeek} AND ${endOfWeek}
    // `
    const { count } = await supabase
      .from("invoice")
      .select("*", { count: "exact" })
      .eq("invoice_status_id", 4);

    setoverdueInvoicesCount(count);
  };

  const qrRequestNewCount = async () => {
    const { count } = await supabase
      .from("quote_request")
      .select("*", { count: "exact" })
      .eq("est_request_status_id", 1);

    setNewQRRequestCount(count);
  };

  const quotesPendingCount = async () => {
    const { count } = await supabase
      .from("estimate")
      .select("*", { count: "exact" })
      .eq("est_status_id", 4);

    setPendingQuotesCount(count);
  };

  const totalCustomers = async () => {
    const { count } = await supabase
      .from("customer")
      .select("*", { count: "exact" });

    setTotalCustomersCount(count);
  };

  const getRecentQR = async () => {
    const { data, error } = await supabase
      .from("quote_request")
      .select("id, est_request_status_id, service_type_id, firstName, lastName")
      .order("updated_at", { ascending: false })
      .limit(4);

    if (error) {
      console.log(error);
    }
    setQuoteRequestsRecentData(data);
  };

  const getRecentQuotes = async () => {
    const { data, error } = await supabase
      .from("estimate")
      .select(
        "*, customer:customer_id(*), estimate_status:est_status_id(*), service_type:service_type_id(*)"
      )
      .order("updated_at", { ascending: false })
      .limit(4);

    if (error) {
      console.log(error);
    }
    setQuotesRecentData(data);
  };

  const getRecentCustomer = async () => {
    const { data, error } = await supabase
      .from("customer")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(4);

    if (error) {
      console.log(error);
    }
    setCustomerRecentData(data);
  };

  const getRecentInvoices = async () => {
    const { data, error } = await supabase
      .from("invoice")
      .select(
        "*, customer:customer_id(*), invoice_status:invoice_status_id(*), service_type:service_type_id(*)"
      )
      .order("updated_at", { ascending: false })
      .limit(4);

    if (error) {
      console.log(error);
    }
    setInvoiceRecentData(data);
    // console.log(invoiceRecentData);
  };

  const getMonthlyRevenues = async() => {
    const { data, error } = await supabase
    .rpc('get_monthly_invoice_revenue_dataset', { year_input: currentYear})

    if(error){
      console.log(error)
    }
    setMonthlyGraphRevenueDataSet01(data);

    console.log(data)

  }

  const getMonthlyRevenues02 = async() => {
    const { data, error } = await supabase
    .rpc('get_monthly_invoice_revenue_dataset', { year_input: lastYear})

    if(error){
      console.log(error)
    }
    setMonthlyGraphRevenueDataSet02(data)
    console.log(data)
  }

  const getMonthlyRevenues03 = async() => {
    const { data, error } = await supabase
    .rpc('get_monthly_invoice_revenue_dataset', { year_input: twoYearsAgo})

    if(error){
      console.log(error)
    }
    setMonthlyGraphRevenueDataSet03(data)
    console.log(data)
  }

  const data = {
    labels,  
    datasets: [
      {
        label: currentYear,
        data: labels.map((label, index) => monthlyGraphRevenueDataSet01 ? monthlyGraphRevenueDataSet01[index]?.month_total : 0),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.3)",
      },
      {
        label: lastYear,
        data: labels.map((label, index) => monthlyGraphRevenueDataSet02 ? monthlyGraphRevenueDataSet02[index]?.month_total : 0),
        borderColor: "rgba(255, 99, 132, .7)",
        backgroundColor: "rgba(255, 99, 132, 0.3",
      },
      {
        label: twoYearsAgo,
        data: labels.map((label, index) => monthlyGraphRevenueDataSet03 ? monthlyGraphRevenueDataSet03[index]?.month_total : 0),
        borderColor: "rgba(43, 166, 37, 0.7)",
        backgroundColor: "rgba(59, 225, 51, 0.3)",
      }
    ],
  };

  return (
    <>
      <Flex flexDir="column" px={{ base: "1rem", lg: "1rem" }} w={"full"}>
        {/* <VStack w='full' px={'1rem'}>
                    <Stack direction={'row'} justify='flex-start' marginBottom={'1rem'}  w={'full'} spacing='0' mt={'1rem'}>
                        <Stack direction={'column'} spacing='0' mr={'auto'}>
                            <Text fontSize={'3xl'} fontWeight='bold' marginTop='2rem'>Main Dashboard</Text>
                            <Text fontSize='md' color='gray.500'>Rios Roofing Web Application by CoogTech</Text>
                        </Stack>
                        <HStack bg={bg} borderColor={borderColor} marginBottom='0rem' spacing='4' shadow='sm' padding='4' rounded='xl' borderWidth='1px'>
                            <Image rounded='full' boxSize='70px' src={`${loggedInUserData.avatar_url}`} alt='user-profile'/>
                            <VStack maxW='full' spacing='0rem' align='start'>
                                <Text fontSize='md' fontWeight='semibold' >{loggedInUserData.full_name}</Text>   
                                <Text fontSize='sm'>{loggedInUserData.email}</Text>
                            </VStack>
                            <Button onClick={logout}>Logout</Button>
                        </HStack>
                    </Stack>
                    <Stack w={'full'} wrap='wrap' direction={["column", "column", "column", "row"]} align='center' spacing='1rem'>
                        <EstimateRequestCountCard bg={bg} borderColor={borderColor}/>
                        <MonthlyRevenueCard bg={bg} borderColor={borderColor}/>
                        <EstimateCountCard bg={bg} borderColor={borderColor}/>
                        <CustomerCountCard bg={bg} borderColor={borderColor}/>
                    </Stack>

                </VStack> */}
        <Box mt={"1rem"} display={{ base: "none", lg: "block" }}>
          <Card
            bg={useColorModeValue("white", "gray.700")}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <Flex justifyContent={"space-between"}>
              {/* <Text>{loggedInUserData.email}</Text> */}
              <Box display={"flex"} alignItems={"center"}>
                <IconButton
                  variant={"ghost"}
                  onClick={onSearchOpen}
                  aria-label="Search database"
                  icon={<FiSearch />}
                  size={"md"}
                />
              </Box>
              <Flex>
                <Flex alignItems={"center"}>
                  <Popover>
                    <PopoverTrigger>
                      <IconButton
                        variant={"ghost"}
                        icon={<FiBell />}
                        mx={"10px"}
                        size={"md"}
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader fontWeight={"bold"}>
                        <Flex alignItems={"center"}>
                          <Icon as={FiBell} mr={"2"} />
                          Notifications
                        </Flex>
                      </PopoverHeader>
                      <PopoverBody display={"flex"} justifyContent={"center"}>
                        <Text>No Notification!</Text>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  <Divider orientation="vertical" px={"10px"} mx={"1px"} />
                </Flex>
                <Menu>
                  <MenuButton
                    _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
                    py={1}
                    px={2}
                    rounded="10"
                  >
                    <Flex flexDir={"row"} alignItems="center">
                      {loggedInUserData ? (
                        <Avatar
                          size={"sm"}
                          src={`${loggedInUserData.avatar_url}`}
                        >
                          <AvatarBadge boxSize="1.25em" bg="green.500" />
                        </Avatar>
                      ) : (
                        <SkeletonCircle size="10" />
                      )}
                      <Flex>
                        <Text ml={"10px"} fontSize={"16px"}>
                          Hi,
                        </Text>
                        <Text ml={"4px"} fontWeight={"bold"} fontSize={"16px"}>
                          {loggedInUserData ? (
                            loggedInUserData.full_name
                          ) : (
                            <SkeletonText
                              mt="4"
                              noOfLines={4}
                              spacing="4"
                              skeletonHeight="2"
                            />
                          )}
                        </Text>
                      </Flex>
                      <Icon as={BsChevronDown} mx={"10px"} />
                    </Flex>
                  </MenuButton>
                  <MenuList bg={useColorModeValue("white", "gray.700")}>
                    <MenuItem display={"flex"} flexDir={"column"}>
                      {loggedInUserData ? (
                        <Image
                          boxSize={"3rem"}
                          borderRadius="full"
                          src={loggedInUserData.avatar_url}
                        />
                      ) : (
                        <SkeletonCircle />
                      )}
                      <span>
                        {loggedInUserData ? (
                          <Text mt={"2"} fontWeight={"bold"} fontSize={"lg"}>
                            {loggedInUserData.full_name}
                          </Text>
                        ) : (
                          <SkeletonText
                            mt="4"
                            noOfLines={4}
                            spacing="4"
                            skeletonHeight="2"
                          />
                        )}
                      </span>
                      <span>
                        {loggedInUserData ? (
                          <Text fontSize={"sm"}>{loggedInUserData.email}</Text>
                        ) : (
                          <SkeletonText
                            mt="4"
                            noOfLines={4}
                            spacing="4"
                            skeletonHeight="2"
                          />
                        )}
                      </span>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>Settings</MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={logout}>Sign out</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </Flex>
          </Card>
        </Box>
        <SimpleGrid
          spacing={4}
          columns={2}
          minChildWidth="170px"
          pb={"0rem"}
          pt={{ base: "2rem", lg: "1rem" }}
        >
          <Card
            bg={useColorModeValue("white", "gray.700")}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            {newQRRequestCount === 0 || newQRRequestCount ? (
              <>
                <Stat>
                  <Icon as={FiInbox} boxSize={"6"} />
                  <StatLabel display={"flex"} fontWeight={"bold"}>
                    New QR's{" "}
                    <Flex
                      bg={"green.400"}
                      rounded="full"
                      w={"1px"}
                      p="1"
                      my={2}
                      ml="10px"
                    ></Flex>
                  </StatLabel>
                  <StatNumber>
                    {newQRRequestCount ? (
                      newQRRequestCount
                    ) : (
                      <Spinner speed="0.65s" />
                    )}
                  </StatNumber>
                  {/* <StatHelpText>
                                    <StatArrow type='increase' />
                                    5%
                                </StatHelpText> */}
                </Stat>
              </>
            ) : (
              <Skeleton height={"90px"} rounded={"md"} />
            )}
          </Card>
          <Card
            bg={useColorModeValue("white", "gray.700")}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            {overdueInvoicesCount === 0 || overdueInvoicesCount ? (
              <>
                <Stat>
                  <Icon as={FiFileText} boxSize={"6"} />
                  <StatLabel display={"flex"} fontWeight={"bold"}>
                    Invoices Overdue
                    <Flex
                      bg={"red.400"}
                      rounded="full"
                      w={"1px"}
                      p="1"
                      my={2}
                      ml="10px"
                    ></Flex>
                  </StatLabel>
                  <StatNumber>
                    {overdueInvoicesCount ? (
                      overdueInvoicesCount
                    ) : overdueInvoicesCount === 0 ? (
                      overdueInvoicesCount
                    ) : (
                      <Spinner speed="0.60s" />
                    )}
                  </StatNumber>
                  {/* <StatHelpText>
                                    <StatArrow type='increase' color={'red.500'} />
                                    1%
                                </StatHelpText> */}
                </Stat>
              </>
            ) : (
              <Skeleton height={"90px"} rounded={"md"} />
            )}
          </Card>
          <Card
            bg={useColorModeValue("white", "gray.700")}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            {pendingQuotesCount === 0 || pendingQuotesCount ? (
              <>
                <Stat>
                  <Icon as={TbRuler} boxSize={"6"} />
                  <StatLabel display={"flex"} fontWeight={"bold"}>
                    Pending Quotes
                    <Flex
                      bg={"yellow.400"}
                      rounded="full"
                      w={"1px"}
                      p="1"
                      my={2}
                      ml="10px"
                    ></Flex>
                  </StatLabel>
                  <StatNumber>
                    {pendingQuotesCount ? (
                      pendingQuotesCount
                    ) : pendingQuotesCount === 0 ? (
                      pendingQuotesCount
                    ) : (
                      <Spinner speed="0.60s" />
                    )}
                  </StatNumber>
                  {/* <StatHelpText>
                                    <StatArrow type='increase' />
                                    8%
                                </StatHelpText> */}
                </Stat>
              </>
            ) : (
              <Skeleton height={"90px"} rounded={"md"} />
            )}
          </Card>
          <Card
            bg={useColorModeValue("white", "gray.700")}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            {totalCustomersCount === 0 || totalCustomersCount ? (
              <>
                <Stat>
                  <Icon as={FiUsers} boxSize={"6"} />
                  <StatLabel display={"flex"} fontWeight={"bold"}>
                    Total Customers
                    <Flex
                      bg={"green.400"}
                      rounded="full"
                      w={"1px"}
                      p="1"
                      my={2}
                      ml="10px"
                    ></Flex>
                  </StatLabel>
                  <StatNumber>
                    {totalCustomersCount ? (
                      totalCustomersCount
                    ) : totalCustomersCount === 0 ? (
                      totalCustomersCount
                    ) : (
                      <Spinner speed="0.60s" />
                    )}
                  </StatNumber>
                  {/* <StatHelpText>
                                    <StatArrow type='increase' />
                                    32%
                                </StatHelpText> */}
                </Stat>
              </>
            ) : (
              <Skeleton height={"90px"} rounded={"md"} />
            )}
          </Card>
        </SimpleGrid>
        <SimpleGrid
          spacing={4}
          minChildWidth="170px"
          pb={"1rem"}
          pt={{ base: "2rem", lg: "1rem" }}
        >
          <Card
            bg={useColorModeValue("white", "gray.700")}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <Stat>
              <Icon as={FiCreditCard} boxSize={"6"} />
              <StatLabel display={"flex"} fontWeight={"bold"}>
                Weekly Revenue
                <Flex
                  bg={"green.400"}
                  rounded="full"
                  w={"1px"}
                  p="1"
                  my={2}
                  ml="10px"
                ></Flex>
              </StatLabel>
              <StatNumber>$34,500</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                14%
              </StatHelpText>
            </Stat>
          </Card>
          <Card
            bg={useColorModeValue("white", "gray.700")}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <Stat>
              <Icon as={FiDollarSign} boxSize={"6"} />
              <StatLabel display={"flex"} fontWeight={"bold"}>
                Weekly Profits
                <Flex
                  bg={"green.400"}
                  rounded="full"
                  w={"1px"}
                  p="1"
                  my={2}
                  ml="10px"
                ></Flex>
              </StatLabel>
              <StatNumber>$24,150</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                32%
              </StatHelpText>
            </Stat>
          </Card>
        </SimpleGrid>
        <SimpleGrid spacing={4} mb={"2rem"} minChildWidth={"420px"}>
          <Card
            bg={useColorModeValue("white", "gray.700")}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <Flex alignItems={"center"} mb={"1rem"} ml="8px">
              <Icon as={FiBarChart2} boxSize={6} />
              <Text ml={"10px"} fontSize="2xl" fontWeight={"bold"}>
                Monthly Revenue
              </Text>
            </Flex>
            <Flex justifyContent={"center"} pb={"1rem"}>
              <Line options={options} data={data} />
            </Flex>
          </Card>
          <Card
            bg={useColorModeValue("white", "gray.700")}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <Flex alignItems={"center"} mb={"1rem"} ml="8px">
              <Icon as={FiActivity} boxSize={6} />
              <Text ml={"1rem"} fontSize="2xl" fontWeight={"bold"}>
                Recent Activity
              </Text>
            </Flex>
            <Tabs variant={"soft-rounded"}>
              <TabList>
                <Tab>QR's</Tab>
                <Tab>Quotes</Tab>
                <Tab>Invoices</Tab>
                <Tab>Customers</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {quoteRequestsRecentData ? (
                    <TableContainer>
                      <Table variant="simple" size={"sm"}>
                        <TableCaption>
                          Recent Quote Requests Updated 👋
                        </TableCaption>
                        <Thead>
                          <Tr>
                            <Th>QR#</Th>
                            <Th>Status</Th>
                            <Th>Service</Th>
                            <Th>Name</Th>
                            <Th></Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {quoteRequestsRecentData?.map((item, index) => (
                            <Tr key={item.id}>
                              <Td fontWeight={"bold"}>{item.id}</Td>
                              <Td>
                                {item.est_request_status_id === 1 ? (
                                  <>
                                    <Text
                                      textColor={"white"}
                                      bg={"green.500"}
                                      py={"6px"}
                                      rounded={"xl"}
                                      align="center"
                                      w={"80px"}
                                    >
                                      New
                                    </Text>
                                  </>
                                ) : "" || item.est_request_status_id === 2 ? (
                                  <>
                                    <Text
                                      textColor={"white"}
                                      bg={"blue.500"}
                                      py={"6px"}
                                      rounded={"xl"}
                                      align="center"
                                      w={"80px"}
                                    >
                                      Scheduled
                                    </Text>
                                  </>
                                ) : "" || item.est_request_status_id === 5 ? (
                                  <>
                                    <Text
                                      textColor={"white"}
                                      bg={"red.500"}
                                      py={"6px"}
                                      rounded={"xl"}
                                      align="center"
                                      w={"80px"}
                                    >
                                      Closed
                                    </Text>
                                  </>
                                ) : "" || item.est_request_status_id === 3 ? (
                                  <>
                                    <Text
                                      textColor={"white"}
                                      bg={"yellow.500"}
                                      py={"6px"}
                                      rounded={"xl"}
                                      align="center"
                                      w={"80px"}
                                    >
                                      Pending
                                    </Text>
                                  </>
                                ) : (
                                  ""
                                )}
                              </Td>
                              <Td>
                                <Text>
                                  {item.service_type_id === 1
                                    ? "Roof Replacement"
                                    : ""}
                                  {item.service_type_id === 2
                                    ? "Roof Leak Repair"
                                    : ""}
                                  {item.service_type_id === 3
                                    ? "Roof Maintenance"
                                    : ""}
                                </Text>
                              </Td>
                              <Td>
                                <Flex>
                                  <Text>{item.firstName}</Text>
                                  <Text ml={"5px"}>{item.lastName}</Text>
                                </Flex>
                              </Td>
                              <Td>
                                <Link to={"/estimate-requests"}>
                                  <Button
                                    colorScheme={"gray"}
                                    variant={"solid"}
                                  >
                                    <MdKeyboardArrowRight size={"20px"} />
                                  </Button>
                                </Link>
                              </Td>
                              {/* <Td><Link to={`/estimate-request`}><Tooltip label='Go to QR Details '><Button ml={'0rem'} colorScheme={'gray'} variant='solid'><MdKeyboardArrowRight size={'20px'}/></Button></Tooltip></Link></Td> */}
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Skeleton height="200px" rounded={"md"} />
                  )}
                </TabPanel>
                <TabPanel>
                  <TableContainer>
                    {quotesRecentData ? (
                      <>
                        <Table variant="simple" size={"sm"}>
                          <TableCaption>
                            Recently updated quotes 👋
                          </TableCaption>
                          <Thead>
                            <Tr>
                              <Th>Q#</Th>
                              <Th>Status</Th>
                              <Th>Service</Th>
                              <Th>Customer</Th>
                              <Th>Total</Th>
                              <Th></Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {quotesRecentData.map((item, index) => (
                              <Tr key={item.id}>
                                <Td fontWeight={"bold"}>
                                  {item.estimate_number}
                                </Td>
                                <Td>
                                  {item.estimate_status.name === "Sent" ? (
                                    <>
                                      <Text
                                        color={"white"}
                                        mx={"auto"}
                                        bg={"yellow.500"}
                                        p="1"
                                        rounded={"xl"}
                                        align="center"
                                        w={"80px"}
                                      >
                                        Sent
                                      </Text>
                                    </>
                                  ) : (
                                    "false"
                                  )}
                                </Td>
                                <Td>{item.service_type.name}</Td>
                                <Td>
                                  <Flex>
                                    <Text>{item.customer.first_name}</Text>
                                    <Text ml={"4px"}>
                                      {item.customer.last_name}
                                    </Text>
                                  </Flex>
                                </Td>
                                <Td fontWeight={"bold"}>${item.total}</Td>
                                <Td>
                                  <Link to={"/estimates"}>
                                    <Button
                                      colorScheme={"gray"}
                                      variant={"solid"}
                                    >
                                      <MdKeyboardArrowRight size={"20px"} />
                                    </Button>
                                  </Link>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </>
                    ) : (
                      <Skeleton height={"200px"} rounded={"md"} />
                    )}
                  </TableContainer>
                </TabPanel>
                <TabPanel>
                  <TableContainer>
                    {invoiceRecentData ? (
                      <>
                        <Table variant="simple" size={"sm"}>
                          <TableCaption>
                            Recently updated invoices 👋
                          </TableCaption>
                          <Thead>
                            <Tr>
                              <Th>INV#</Th>
                              <Th>Status</Th>
                              <Th>Service</Th>
                              <Th>Customer</Th>
                              <Th>Total</Th>
                              <Th></Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {invoiceRecentData?.map((item, index) => (
                              <Tr key={item.id}>
                                <Td fontWeight={"bold"}>
                                  {item.invoice_number}
                                </Td>
                                <Td>
                                  {item.invoice_status.name === "Sent" ? (
                                    <>
                                      <Text
                                        color={"white"}
                                        mx={"auto"}
                                        bg={"yellow.500"}
                                        p="1"
                                        rounded={"xl"}
                                        align="center"
                                        w={"80px"}
                                      >
                                        Sent
                                      </Text>
                                    </>
                                  ) : item.invoice_status.name === "New" ? (
                                    <>
                                      <Text
                                        color={"white"}
                                        mx={"auto"}
                                        bg={"green.500"}
                                        p={"1"}
                                        rounded={"xl"}
                                        align={"center"}
                                        w={"80px"}
                                      >
                                        New
                                      </Text>
                                    </>
                                  ) : item.invoice_status.name === "Paid" ? (
                                    <Text
                                      color={"white"}
                                      mx={"auto"}
                                      bg={"blue.500"}
                                      p={"1"}
                                      rounded={"xl"}
                                      align={"center"}
                                      w={"80px"}
                                    >
                                      Paid
                                    </Text>
                                  ) : item.invoice_status.name === "Paid" ? (
                                    <Text
                                      color={"white"}
                                      mx={"auto"}
                                      bg={"red.500"}
                                      p={"1"}
                                      rounded={"xl"}
                                      align={"center"}
                                      w={"80px"}
                                    >
                                      Outstanding
                                    </Text>
                                  ) : (
                                    "false"
                                  )}
                                </Td>
                                <Td>{item.service_type.name}</Td>
                                <Td>
                                  <Flex>
                                    <Text>{item.customer.first_name}</Text>
                                    <Text ml={"4px"}>
                                      {item.customer.last_name}
                                    </Text>
                                  </Flex>
                                </Td>
                                <Td fontWeight={"bold"}>${item.total}</Td>
                                <Td>
                                  <Link to={`/editinvoice/${item.id}`}>
                                    <Button
                                      colorScheme={"gray"}
                                      variant={"solid"}
                                    >
                                      <MdKeyboardArrowRight size={"20px"} />
                                    </Button>
                                  </Link>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </>
                    ) : (
                      <Skeleton height={"200px"} rounded={"md"} />
                    )}
                  </TableContainer>
                </TabPanel>
                <TabPanel>
                  {customerRecentData ? (
                    <>
                      <Table variant="simple" size={"sm"}>
                        <TableCaption>
                          Recently updated customers 👋
                        </TableCaption>
                        <Thead>
                          <Tr>
                            <Th>Customer</Th>
                            <Th>Type</Th>
                            <Th></Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {customerRecentData?.map((item, index) => (
                            <Tr key={item.id}>
                              <Td>
                                {item.first_name && item.last_name ? (
                                  <>
                                    <Flex>
                                      <Avatar
                                        size={"sm"}
                                        mr={"18px"}
                                        my={"auto"}
                                      />
                                      <Flex flexDir={"column"}>
                                        <Flex
                                          fontWeight={"bold"}
                                          fontSize={"md"}
                                        >
                                          <Text marginRight={"4px"}>
                                            {item.first_name}
                                          </Text>
                                          <Text>{item.last_name}</Text>
                                        </Flex>
                                        <Flex mt={"4px"} fontWeight={"light"}>
                                          {item.email}
                                        </Flex>
                                      </Flex>
                                    </Flex>
                                  </>
                                ) : (
                                  <>{item.company_name}</>
                                )}
                              </Td>
                              <Td>
                                <Badge
                                  padding={"7px"}
                                  rounded={"full"}
                                  textAlign={"center"}
                                  w="100px"
                                  colorScheme={
                                    item.customer_type_id === 1
                                      ? "blue"
                                      : item.customer_type_id === 2
                                      ? "green"
                                      : item.customer_type_id === 3
                                      ? "yellow"
                                      : ""
                                  }
                                  variant={"subtle"}
                                  ml={"1rem"}
                                >
                                  {item.customer_type_id === 1
                                    ? "Residential"
                                    : item.customer_type_id === 2
                                    ? "Commercial"
                                    : item.customer_type_id === 3
                                    ? "Other"
                                    : ""}
                                </Badge>
                              </Td>
                              <Td>
                                <Link to={`/editcustomer/${item.id}`}>
                                  <Button
                                    colorScheme={"gray"}
                                    variant={"solid"}
                                  >
                                    <MdKeyboardArrowRight size={"20px"} />
                                  </Button>
                                </Link>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </>
                  ) : (
                    <Skeleton height={"200px"} rounded={"md"} />
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Card>
        </SimpleGrid>
      </Flex>
      <Drawer placement="top" onClose={onSearchClose} isOpen={isSearchOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <Flex>
              <Input variant="filled" placeholder="Search..." />
              <IconButton icon={<FiX />} ml={"1rem"} onClick={onSearchClose} />
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Dashboard;
