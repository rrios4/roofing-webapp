import React, {useState, useEffect} from 'react';
import Card from '../../ui/Card/index';
import { Box, Flex, Text, Grid, Button, Image, VStack, HStack, Stack, Spinner, border } from "@chakra-ui/react";
import { MdPeopleAlt } from 'react-icons/md'
import supabase from '../../../utils/supabaseClient';

const CustomerCountCard = (props) => {
    const [totalCustomers, setTotalCustomers] = useState('');
    const {bg, borderColor} = props


    useEffect(() => {
      getTotalCustomers()

    }, [])
    
    const getTotalCustomers = async() => {
        const { count, error } = await supabase
        .from('customer')
        .select('*', {count: "exact"})

        if(error){
            console.log(error)
        }
        setTotalCustomers(count)
    }


  return (
    <Card width={'300px'} bg={bg} borderColor={borderColor}>
        <HStack>
            <Box display={'flex'} rounded={'full'} bg='gray.100' w={'60px'} h={'60px'} padding='1rem' justifyContent='center'>
                <MdPeopleAlt color='#2B6CB0' size={'30px'} />
            </Box>
            <Stack direction={'column'} pl={'1rem'} spacing='0'>
                <Text fontSize={'xs'} textColor='gray.400' fontWeight={'bold'} margin='0' padding={'0'}>Total Customers</Text>
                <Text fontWeight={'bold'} fontSize={'2xl'} margin='0' padding={'0'}>{totalCustomers ? totalCustomers : <Spinner/>}</Text>
            </Stack>
        </HStack>
    </Card>
  )
}

export default CustomerCountCard