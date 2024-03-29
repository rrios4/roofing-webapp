import React from 'react';
import {
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { MdOutlinePayments, MdTransform } from 'react-icons/md';
import { AiOutlineBars } from 'react-icons/ai';
import { RefreshCcw, MoreHorizontal, Share, FileOutput, ChevronLeft } from 'lucide-react';

const QuoteDetailsHeader = (props) => {
  const { quoteById, onExportPDFOpen, handleEditQuoteModal, openConvertAlert } = props;
  return (
    <>
      {/* Header */}
      <Flex justify={'space-between'} mb={'1rem'} flexDir={{ base: 'row', lg: 'row' }}>
        <Flex mx={'1rem'} gap={4} mb={{ base: '0rem', lg: '0' }}>
          <Link to={`/quotes`}>
            <Button
              bg={useColorModeValue('white', 'gray.800')}
              border={'1px'}
              shadow={'xs'}
              borderColor={'gray.300'}>
              <ChevronLeft size={'15px'} />
            </Button>
          </Link>
          {/* <Text my={'auto'} fontSize={'xl'} fontWeight={'bold'}>INV #{id}</Text> */}
        </Flex>
        <Flex px={'1rem'} gap={4} ml={{ base: 'auto', lg: '0' }}>
          <Menu>
            <MenuButton
              as={Button}
              bg={useColorModeValue('white', 'gray.800')}
              border={'1px'}
              shadow={'xs'}
              borderColor={'gray.300'}>
              <MoreHorizontal size={'15px'} />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiEdit />} onClick={() => handleEditQuoteModal(quoteById)}>
                Edit Quote
              </MenuItem>
              <MenuItem icon={<MdOutlinePayments />}>Edit Payments</MenuItem>
              <MenuItem icon={<AiOutlineBars />}>Edit Line Items</MenuItem>
            </MenuList>
          </Menu>
          <Tooltip hasArrow label="Convert Quote to Invoice">
            <Button
              bg={useColorModeValue('white', 'gray.800')}
              border={'1px'}
              shadow={'xs'}
              borderColor={'gray.300'}
              onClick={() => openConvertAlert()}>
              <RefreshCcw size={'15px'} />
            </Button>
          </Tooltip>
          {/* <Tooltip hasArrow label="More"><Button colorScheme={'gray'}><FiMoreHorizontal/></Button></Tooltip> */}
          {/* <Tooltip hasArrow label="Share">
            <Button colorScheme={'gray'}>
              <FiShare2 />
            </Button>
          </Tooltip> */}
          {/* <Tooltip hasArrow label="Send Quote">
            <Button colorScheme={'blue'} gap={2}>
              <FiSend />
              Send Quote
            </Button>
          </Tooltip> */}
          <Button colorScheme="blue" gap="3" onClick={onExportPDFOpen}>
            <FileOutput size={'15px'} /> Export as PDF
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default QuoteDetailsHeader;
