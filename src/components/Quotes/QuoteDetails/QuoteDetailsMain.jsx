import React from 'react';
import {
  Tooltip,
  Card,
  CardBody,
  Flex,
  Button,
  Image,
  Box,
  Text,
  Skeleton,
  Divider
} from '@chakra-ui/react';
import { FiPaperclip, FiUploadCloud } from 'react-icons/fi';
import { formatMoneyValue, formatNumber } from '../../../utils';
import { QuoteDetailsLineItemTable } from '../../../components/index';

const QuoteDetailsMain = (props) => {
  const {
    quoteById,
    paymentCardBgColor,
    secondaryTextColor,
    handleLineItemDelete,
    editSwitchIsOn,
    bgColorMode
  } = props;
  return (
    <>
      <Card w={'full'} rounded={'xl'}>
        <CardBody>
          {/* Header with Buttons */}
          <Flex justifyContent={'flex-end'} pr={'1rem'}>
            <Tooltip hasArrow label="Upload images">
              <Button variant={'outline'} roundedRight={'none'}>
                <FiUploadCloud />
              </Button>
            </Tooltip>
            <Tooltip hasArrow label="Upload documents">
              <Button variant={'outline'} roundedLeft={'none'}>
                <FiPaperclip />
              </Button>
            </Tooltip>
          </Flex>
          <Flex px={'2rem'} pb="3rem">
            <Image src="/LogoRR.png" maxW={'70px'} p={'1'} bg={'blue.500'} rounded={'2xl'} />
            <Box ml={'2rem'}>
              <Text fontWeight={'semibold'} fontSize={'3xl'} letterSpacing={'0px'}>
                Quote{' '}
                <Text as={'span'} color={'blue.400'}>
                  #
                </Text>{' '}
                {formatNumber(quoteById?.quote_number)}
              </Text>
              <Text fontSize={'sm'} fontWeight={'semibold'} textColor={'gray.500'}>
                Expires {quoteById?.expiration_date}
              </Text>
            </Box>
          </Flex>
          <Box px={'2rem'} mb={'3rem'}>
            <Flex mb={'1rem'}>
              <Text w="50px" fontWeight={'bold'} textColor={'gray.500'}>
                To
              </Text>
              {!quoteById ? (
                <Skeleton
                  bg={paymentCardBgColor}
                  height={'100px'}
                  w={'250px'}
                  rounded={'xl'}
                  mx={'1rem'}
                />
              ) : (
                <>
                  {quoteById?.custom_address === true ? (
                    <>
                      <Box>
                        <Text ml={'3rem'} fontWeight={'semibold'}>
                          {quoteById?.customer?.first_name} {quoteById?.customer?.last_name}
                        </Text>
                        <Box
                          _hover={{ cursor: 'pointer', color: 'blue.500' }}
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/search/?api=1&query=${quoteById?.custom_street_address}+${quoteById?.custom_city}+${quoteById?.custom_state}+${quoteById?.custom_zipcode}`
                            )
                          }>
                          <Text ml={'3rem'}>{quoteById?.custom_street_address}</Text>
                          <Text ml={'3rem'}>
                            {quoteById?.custom_city}, {quoteById?.custom_state}{' '}
                            {quoteById?.custom_zipcode}
                          </Text>
                        </Box>
                        <Text ml={'3rem'} color={'blue.400'}>
                          {quoteById?.customer?.email}
                        </Text>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box>
                        <Text ml={'3rem'} fontWeight={'semibold'}>
                          {quoteById?.customer?.first_name} {quoteById?.customer?.last_name}
                        </Text>
                        <Box
                          _hover={{ cursor: 'pointer', color: 'blue.500' }}
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/search/?api=1&query=${quoteById?.customer.street_address}+${quoteById?.customer.city}+${quoteById?.customer.state}+${quoteById?.customer.zipcode}`
                            )
                          }>
                          <Text ml={'3rem'}>{quoteById?.customer?.street_address}</Text>
                          <Text ml={'3rem'}>
                            {quoteById?.customer?.city}, {quoteById?.customer?.state}{' '}
                            {quoteById?.customer?.zipcode}
                          </Text>
                        </Box>
                        <Text ml={'3rem'} color={'blue.400'}>
                          {quoteById?.customer?.email}
                        </Text>
                      </Box>
                    </>
                  )}
                </>
              )}
            </Flex>
            <Flex mb={'1rem'}>
              <Text w="50px" fontWeight={'bold'} textColor={'gray.500'}>
                From
              </Text>
              {!quoteById ? (
                <Skeleton
                  bg={paymentCardBgColor}
                  height={'100px'}
                  w={'250px'}
                  rounded={'xl'}
                  mx={'1rem'}
                />
              ) : (
                <>
                  <Box>
                    <Text ml={'3rem'} fontWeight={'semibold'}>
                      Rios Roofing
                    </Text>
                    <Text ml={'3rem'}>150 Tallant St</Text>
                    <Text ml={'3rem'}>Houston, TX 77076</Text>
                    <Text ml={'3rem'} color={'blue.400'}>
                      rrios.roofing@gmail.com
                    </Text>
                  </Box>
                </>
              )}
            </Flex>
            <Flex>
              <Text w="50px" fontWeight={'bold'} textColor={'gray.500'}>
                Note
              </Text>
              {!quoteById ? (
                <Skeleton
                  bg={paymentCardBgColor}
                  height={'20px'}
                  w={'250px'}
                  rounded={'xl'}
                  mx={'1rem'}
                />
              ) : (
                <>
                  <Text ml={'3rem'} maxW="500px">
                    {quoteById?.cust_note}
                  </Text>
                </>
              )}
            </Flex>
          </Box>
          <Divider w={'95%'} mx={'auto'} />

          {/* Line Item Table */}
          <QuoteDetailsLineItemTable
            quoteById={quoteById}
            handleLineItemDelete={handleLineItemDelete}
            editSwitchIsOn={editSwitchIsOn}
            paymentCardBgColor={paymentCardBgColor}
            bgColorMode={bgColorMode}
          />

          <Box px={'4rem'} pb="2rem">
            <Flex mb={'2rem'} px={4} py={2}>
              <Text fontWeight={'semibold'} textColor={secondaryTextColor}>
                Subtotal
              </Text>
              <Text ml={'auto'} mr={'1rem'}>
                ${formatMoneyValue(quoteById?.subtotal)}
              </Text>
            </Flex>
            <Flex mb={'2rem'} bg={'blue.500'} color={'white'} px={4} py={4} rounded={'xl'}>
              <Text fontWeight={'bold'} fontSize={'xl'}>
                Total
              </Text>
              <Text ml={'auto'} fontWeight={'bold'} fontSize={'xl'}>
                ${formatMoneyValue(quoteById?.total)}
              </Text>
            </Flex>
          </Box>
        </CardBody>
      </Card>
    </>
  );
};

export default QuoteDetailsMain;
