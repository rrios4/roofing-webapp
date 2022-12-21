import React, { useEffect, useState } from 'react'
import { Box, useDisclosure, Flex, Text, Grid, Button, Image, VStack, HStack, Stack, useColorModeValue, border, Input, SimpleGrid, StatLabel, StatNumber, StatHelpText, StatArrow, Stat, Tabs, TabList, TabPanels, Tab, TabPanel, Icon, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, SkeletonCircle, IconButton, AvatarBadge, SkeletonText, Divider, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody, DrawerHeader } from "@chakra-ui/react";
import swal from 'sweetalert';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth'
import { FcRuler, FcMoneyTransfer, FcConferenceCall, FcDepartment, FcGallery } from 'react-icons/fc'
import { Card, CustomerCountCard, EstimateRequestCountCard, MonthlyRevenueCard, EstimateCountCard } from '../../components';
import { FiActivity, FiBarChart2, FiUsers, FiInbox, FiGrid, FiFileText, FiMenu, FiCreditCard, FiDollarSign, FiSearch, FiArrowDown, FiBell, FiX } from 'react-icons/fi';
import { BsChevronDown } from 'react-icons/bs'
import { faker } from '@faker-js/faker';
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
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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
            position: 'top',
        },
        title: {
            display: false,
            text: 'Chart.js Line Chart',
        },
    },
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const data = {
    labels,
    datasets: [
        {
            label: '2021',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 200000 })),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: '2022',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 200000 })),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

const Dashboard = ({ children }) => {
    const auth = useAuth()
    const navigate = useNavigate()
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    // console.log(auth.user.user_metadata.avatar_url)
    const [loggedInUserData, setloggedInUserData] = useState('');
    const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();

    useEffect(() => {
        // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
        // if (!localStorage.getItem('supabase.auth.token')) {
        //     history.push('/login');
        // }
        // console.log(localStorage.getItem('supabase.auth.token'))
        userData()
    }, []);

    const logout = () => {
        // localStorage.clear();
        auth.Logout()
        swal("Logged Out!", "You are now logged out from the system!", "success");
        navigate("/login")
    }

    const userData = async () => {
        setloggedInUserData(auth.user.user_metadata)
        console.log(loggedInUserData)
        console.log(bg)
    }

    const handleHoverBG = () => {
        if (bg === 'white') {
            return 'gray.200'
        } else {
            return 'gray.600'
        }
    }


    return (
        <>
            <Flex flexDir='column' px={{ base: '1rem', lg: '1rem' }} w={'full'}>
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
                <Box mt={'1rem'} display={{ base: 'none', lg: 'block' }}>
                    <Card bg={useColorModeValue('white', 'gray.700')} borderColor={useColorModeValue('gray.200', 'gray.700')}>
                        <Flex justifyContent={'space-between'}>
                            {/* <Text>{loggedInUserData.email}</Text> */}
                            <Box display={'flex'} alignItems={'center'}><IconButton onClick={onSearchOpen} aria-label='Search database' icon={<FiSearch />} size={'md'} /></Box>
                            <Flex>
                                <Flex alignItems={'center'}>
                                    <Icon _hover={{ bg: handleHoverBG }} p={'6px'} as={FiBell} mx={'1rem'} boxSize={'8'} rounded={'10px'} />
                                    <Divider orientation='vertical' px={'10px'} mx={'1px'} />
                                </Flex>
                                <Menu>
                                    <MenuButton _hover={{ bg: handleHoverBG }} p={1} rounded='10'>
                                        <Flex flexDir={'row'} alignItems='center'>
                                            {loggedInUserData ? <Avatar size={'sm'} src={`${loggedInUserData.avatar_url}`}><AvatarBadge boxSize='1.25em' bg='green.500' /></Avatar> : <SkeletonCircle size='10' />}
                                            <Flex><Text ml={'10px'} fontSize={'16px'}>Hi,</Text><Text ml={'4px'} fontWeight={'bold'} fontSize={'16px'}>{loggedInUserData ? loggedInUserData.full_name : <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />}</Text></Flex>
                                            <Icon as={BsChevronDown} mx={'10px'} />
                                        </Flex>
                                    </MenuButton>
                                    <MenuList bg={useColorModeValue('white', 'gray.700')}>
                                        <MenuItem display={'flex'} flexDir={'column'}>
                                            {loggedInUserData ? <Image boxSize={'3rem'} borderRadius='full' src={loggedInUserData.avatar_url} /> : <SkeletonCircle />}
                                            <span>{loggedInUserData.full_name}</span>
                                            <span>{loggedInUserData.email}</span>
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
                <SimpleGrid spacing={4} columns={2} minChildWidth='170px' pb={'0rem'} pt={{ base: '2rem', lg: '1rem' }}>
                    <Card bg={useColorModeValue('white', 'gray.700')} borderColor={useColorModeValue('gray.200', 'gray.700')}>
                        <Stat>
                            <Icon as={FiInbox} boxSize={'6'} />
                            <StatLabel display={'flex'} fontWeight={'bold'}>Weekly New QR    <Flex bg={'green.400'} rounded='full' w={'1px'} p='1' my={2} ml='10px'></Flex></StatLabel>
                            <StatNumber>10</StatNumber>
                            <StatHelpText>
                                <StatArrow type='increase' />
                                5%
                            </StatHelpText>
                        </Stat>
                    </Card>
                    <Card bg={useColorModeValue('white', 'gray.700')} borderColor={useColorModeValue('gray.200', 'gray.700')}>
                        <Stat>
                            <Icon as={FiFileText} boxSize={'6'} />
                            <StatLabel display={'flex'} fontWeight={'bold'}>Invoices Overdue<Flex bg={'red.400'} rounded='full' w={'1px'} p='1' my={2} ml='10px'></Flex></StatLabel>
                            <StatNumber>2</StatNumber>
                            <StatHelpText>
                                <StatArrow type='increase' color={'red.500'} />
                                1%
                            </StatHelpText>
                        </Stat>
                    </Card>
                    <Card bg={useColorModeValue('white', 'gray.700')} borderColor={useColorModeValue('gray.200', 'gray.700')}>
                        <Stat>
                            <Icon as={TbRuler} boxSize={'6'} />
                            <StatLabel display={'flex'} fontWeight={'bold'}>Pending Quotes<Flex bg={'yellow.400'} rounded='full' w={'1px'} p='1' my={2} ml='10px'></Flex></StatLabel>
                            <StatNumber>12</StatNumber>
                            <StatHelpText>
                                <StatArrow type='increase' />
                                8%
                            </StatHelpText>
                        </Stat>
                    </Card>
                    <Card bg={useColorModeValue('white', 'gray.700')} borderColor={useColorModeValue('gray.200', 'gray.700')}>
                        <Stat>
                            <Icon as={FiUsers} boxSize={'6'} />
                            <StatLabel display={'flex'} fontWeight={'bold'}>New Customers<Flex bg={'green.400'} rounded='full' w={'1px'} p='1' my={2} ml='10px'></Flex></StatLabel>
                            <StatNumber>23</StatNumber>
                            <StatHelpText>
                                <StatArrow type='increase' />
                                32%
                            </StatHelpText>
                        </Stat>
                    </Card>
                </SimpleGrid>
                <SimpleGrid spacing={4} minChildWidth='170px' pb={'1rem'} pt={{ base: '2rem', lg: '1rem' }}>
                    <Card bg={useColorModeValue('white', 'gray.700')} borderColor={useColorModeValue('gray.200', 'gray.700')}>
                        <Stat>
                            <Icon as={FiCreditCard} boxSize={'6'} />
                            <StatLabel display={'flex'} fontWeight={'bold'}>Weekly Revenue<Flex bg={'green.400'} rounded='full' w={'1px'} p='1' my={2} ml='10px'></Flex></StatLabel>
                            <StatNumber>$34,500</StatNumber>
                            <StatHelpText>
                                <StatArrow type='increase' />
                                14%
                            </StatHelpText>
                        </Stat>
                    </Card>
                    <Card bg={useColorModeValue('white', 'gray.700')} borderColor={useColorModeValue('gray.200', 'gray.700')}>
                        <Stat>
                            <Icon as={FiDollarSign} boxSize={'6'} />
                            <StatLabel display={'flex'} fontWeight={'bold'}>Weekly Profits<Flex bg={'green.400'} rounded='full' w={'1px'} p='1' my={2} ml='10px'></Flex></StatLabel>
                            <StatNumber>$24,150</StatNumber>
                            <StatHelpText>
                                <StatArrow type='increase' />
                                32%
                            </StatHelpText>
                        </Stat>
                    </Card>
                </SimpleGrid>
                <SimpleGrid spacing={4} mb={'2rem'} minChildWidth={'420px'}>
                    <Card bg={useColorModeValue('white', 'gray.700')} borderColor={useColorModeValue('gray.200', 'gray.700')}>
                        <Flex alignItems={'center'} mb={'1rem'} ml='8px' >
                            <Icon as={FiBarChart2} boxSize={6} />
                            <Text ml={'10px'} fontSize='2xl' fontWeight={'bold'}>Monthly Revenue</Text>
                        </Flex>
                        <Flex justifyContent={'center'} pb={'1rem'}>
                            <Line options={options} data={data} />
                        </Flex>
                    </Card>
                    <Card bg={useColorModeValue('white', 'gray.700')} borderColor={useColorModeValue('gray.200', 'gray.700')}>
                        <Flex alignItems={'center'} mb={'1rem'} ml='8px' >
                            <Icon as={FiActivity} boxSize={6} />
                            <Text ml={'1rem'} fontSize='2xl' fontWeight={'bold'}>Recent Activity</Text>
                        </Flex>
                        <Tabs variant={'soft-rounded'} >
                            <TabList>
                                <Tab>Quote Request</Tab>
                                <Tab>Invoices</Tab>
                                <Tab>Quotes</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <p>Quote Request Data Here!</p>
                                </TabPanel>
                                <TabPanel>
                                    <p>Invoices Data Here!</p>
                                </TabPanel>
                                <TabPanel>
                                    <p>Quotes Data Here!</p>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Card>
                </SimpleGrid>
            </Flex> 
            <Drawer placement='top' onClose={onSearchClose} isOpen={isSearchOpen}>
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerBody>
                        <Flex>
                            <Input variant='filled' placeholder='Search...' />
                            <IconButton icon={<FiX/>} ml={'1rem'} onClick={onSearchClose}/>
                        </Flex>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default Dashboard;