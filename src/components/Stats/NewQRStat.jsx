import React from 'react';
import {
  Card,
  Stat,
  Icon,
  StatLabel,
  Flex,
  StatNumber,
  Spinner,
  Skeleton,
  useColorModeValue,
  CardBody
} from '@chakra-ui/react';
import { FiInbox } from 'react-icons/fi';

const NewQRStat = (props) => {
  const { newQRRequestCount } = props;
  return (
    <>
      <Card
        bg={useColorModeValue('white', 'gray.700')}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        rounded={'xl'}>
        {newQRRequestCount === 0 || newQRRequestCount ? (
          <>
            <CardBody>
              <Stat>
                <Icon as={FiInbox} boxSize={'6'} />
                <Flex direction={'column'} flexWrap={'flex-wrap'}>
                  <StatLabel color={'green.500'} fontWeight={'bold'}>
                    New
                  </StatLabel>
                  <StatLabel fontWeight={'semibold'}>
                    Quote Request
                    {/* <Flex bg={'green.400'} rounded="full" w={'1px'} p="1" my={2} ml="10px"></Flex> */}
                  </StatLabel>
                </Flex>

                <StatNumber>
                  {newQRRequestCount ? newQRRequestCount : <Spinner speed="0.65s" />}
                </StatNumber>
                {/* <StatHelpText>
                        <StatArrow type='increase' />
                        5%
                    </StatHelpText> */}
              </Stat>
            </CardBody>
          </>
        ) : (
          <CardBody>
            <Skeleton height={'90px'} rounded={'md'} />
          </CardBody>
        )}
      </Card>
    </>
  );
};

export default NewQRStat;
