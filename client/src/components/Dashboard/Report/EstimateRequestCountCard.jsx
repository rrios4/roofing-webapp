import React, {useEffect, useState} from 'react';
import { HStack, Box, Stack, Text, Spinner } from '@chakra-ui/react';
import { Card } from '../..';
import { MdPeopleAlt, MdScheduleSend } from 'react-icons/md';
import supabase from '../../../utils/supabaseClient';

const EstimateRequestCountCard = () => {
    const [totalEstimateRequest, setTotalEstimateRequest] = useState('')

    useEffect(() => {
      getTotalEstimateRequests()
    
    }, [])

    const getTotalEstimateRequests = async() => {
        const { data, count } = await supabase
            .from('estimate_request')
            .select('*', {count: 'exact'})

        setTotalEstimateRequest(count)
    }    

  return (
    <Card width={'300px'}>
    <HStack>
        <Box display={'flex'} rounded={'full'} bg='gray.100' w={'60px'} h={'60px'} padding='1rem' justifyContent='center'>
            <MdScheduleSend color='#2B6CB0' size={'30px'} />
        </Box>
        <Stack direction={'column'} pl={'1rem'} spacing='0'>
            <Text fontSize={'xs'} textColor='gray.400' fontWeight={'bold'} margin='0' padding={'0'}>New Estimate Requests</Text>
            <Text fontWeight={'bold'} fontSize={'2xl'} margin='0' padding={'0'}>{totalEstimateRequest ? totalEstimateRequest : <Spinner/>}</Text>
        </Stack>
    </HStack>
</Card>
  )
}

export default EstimateRequestCountCard