import React, {useState, useEffect} from 'react';
import {HStack, Box, Stack, Text, Spinner} from '@chakra-ui/react';
import { MdEditLocationAlt } from 'react-icons/md';
import {Card} from '../../';
import supabase from '../../../utils/supabaseClient';

const EstimateCountCard = () => {
    const [totalEstimates, setTotalEstimates] = useState('');

    useEffect(() => {
        getTotalEstimates()
    }, [])
    
    const getTotalEstimates = async() => {
        const {data, count} = await supabase
        .from('estimate')
        .select('*', {count: 'exact'})

        setTotalEstimates(count);
    }

  return (
    <Card width={'300px'}>
        <HStack>
            <Box display={'flex'} rounded={'full'} bg='gray.100' w={'60px'} h={'60px'} padding='1rem' justifyContent='center'>
                <MdEditLocationAlt color='#2B6CB0' size={'30px'} />
            </Box>
            <Stack direction={'column'} pl={'1rem'} spacing='0'>
                <Text fontSize={'xs'} textColor='gray.400' fontWeight={'bold'} margin='0' padding={'0'}>Pending Estimates</Text>
                <Text fontWeight={'bold'} fontSize={'2xl'} margin='0' padding={'0'}>{!totalEstimates ? <>{totalEstimates}</> : <><Spinner/></>}</Text>
            </Stack>
        </HStack>
    </Card>
  )
}

export default EstimateCountCard