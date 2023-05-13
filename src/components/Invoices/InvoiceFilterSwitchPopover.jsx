import React from 'react';
import {
  Flex,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Switch,
  Text
} from '@chakra-ui/react';
import { FiFilter } from 'react-icons/fi';

const InvoiceFilterSwitchPopover = (props) => {
  const { handleSwitches, switchOne, switchTwo, switchThree, switchFour } = props;
  return (
    <>
      {/* Filter Popover */}
      <Popover>
        <PopoverTrigger>
          <IconButton icon={<FiFilter />} colorScheme={'gray'} />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader fontWeight={'bold'}>Filter Invoices</PopoverHeader>
          <PopoverBody>
            <Flex direction={'column'} gap={2} py={'1rem'}>
              {/* Switch 1 */}
              <Flex gap={2}>
                <Switch
                  isChecked={switchOne}
                  onChange={() => handleSwitches(true, false, false, false)}
                />
                <Text my={'auto'} textAlign={'center'}>
                  By Status of{' '}
                  <Text as={'span'} fontWeight={'semibold'}>
                    Draft
                  </Text>
                </Text>
              </Flex>
              {/* Switch 2 */}
              <Flex gap={2}>
                <Switch
                  isChecked={switchTwo}
                  onChange={() => handleSwitches(false, true, false, false)}
                />
                <Text my={'auto'} textAlign={'center'}>
                  By Status of{' '}
                  <Text as={'span'} color={'yellow.400'} fontWeight={'semibold'}>
                    Pending
                  </Text>
                </Text>
              </Flex>
              {/* Switch 3 */}
              <Flex gap={2}>
                <Switch
                  isChecked={switchThree}
                  onChange={() => handleSwitches(false, false, true, false)}
                />
                <Text my={'auto'} textAlign={'center'}>
                  By Status of{' '}
                  <Text as={'span'} color={'green.400'} fontWeight={'semibold'}>
                    Paid
                  </Text>
                </Text>
              </Flex>
              {/* Switch 4 */}
              <Flex gap={2}>
                <Switch
                  isChecked={switchFour}
                  onChange={() => handleSwitches(false, false, false, true)}
                />
                <Text my={'auto'} textAlign={'center'}>
                  By Status of{' '}
                  <Text as={'span'} color={'red.400'} fontWeight={'semibold'}>
                    Overdue
                  </Text>
                </Text>
              </Flex>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default InvoiceFilterSwitchPopover;
