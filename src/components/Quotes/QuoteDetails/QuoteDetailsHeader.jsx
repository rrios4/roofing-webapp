import React from 'react';
import { Flex, Button, Menu, MenuButton, MenuList, MenuItem, Tooltip } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMoreHorizontal, FiEdit, FiShare } from 'react-icons/fi';
import { MdOutlinePayments, MdTransform } from 'react-icons/md';
import { AiOutlineBars } from 'react-icons/ai';
import { RefreshCcw, MoreHorizontal, Share, FileOutput, ChevronLeft } from 'lucide-react';

const QuoteDetailsHeader = (props) => {
  const { quoteById, onExportPDFOpen, handleEditQuoteModal } = props;
  return (
    <>
      {/* Header */}
      <Flex justify={'space-between'} mb={'1rem'} flexDir={{ base: 'row', lg: 'row' }}>
        <Flex mx={'1rem'} gap={4} mb={{ base: '0rem', lg: '0' }}>
          <Link to={`/quotes`}>
            <Button variant={'outline'} border={'1px'} borderColor={'gray.300'}>
              <ChevronLeft size={'15px'} />
            </Button>
          </Link>
          {/* <Text my={'auto'} fontSize={'xl'} fontWeight={'bold'}>INV #{id}</Text> */}
        </Flex>
        <Flex px={'1rem'} gap={4} ml={{ base: 'auto', lg: '0' }}>
          <Menu>
            <MenuButton as={Button} border={'1px'} borderColor={'gray.300'}>
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
            <Button variant={'outline'} border={'1px'} borderColor={'gray.300'}>
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
