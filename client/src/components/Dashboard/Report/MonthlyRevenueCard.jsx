import React, {useState, useEffect} from 'react';
import {Stack, Text, HStack, Box, Spinner, border} from '@chakra-ui/react';
import { Card } from '../..';
import { MdAttachMoney } from 'react-icons/md';
import supabase from '../../../utils/supabaseClient';

const MonthlyRevenueCard = (props) => {
    const [totalRevenues, setTotalRevenues] = useState('');
    const {bg, borderColor} = props

    useEffect(() => {
      getMonthlyRevenue()
    }, [])
    
    const getMonthlyRevenue = async() => {
        const { data, count } = await supabase
        .from('invoice')
        .select('*', {count: 'exact'})

        setTotalRevenues(count)
        console.log(totalRevenues)
    }

  return (
    <Card width={'300px'} bg={bg} borderColor={borderColor}>
        <HStack>
            <Box display={'flex'} rounded={'full'} bg='gray.100' w={'60px'} h={'60px'} padding='1rem' justifyContent='center'>
                <MdAttachMoney color='#2B6CB0' size={'30px'} />
            </Box>
            <Stack direction={'column'} pl={'1rem'} spacing='0'>
                <Text fontSize={'xs'} textColor='gray.400' fontWeight={'bold'} margin='0' padding={'0'}>Revenue this month</Text>
                <Text fontWeight={'bold'} fontSize={'2xl'} margin='0' padding={'0'}>{!totalRevenues ? <>${totalRevenues}</> : <><Spinner/></>}</Text>
            </Stack>
        </HStack>
    </Card>
  )
}

export default MonthlyRevenueCard