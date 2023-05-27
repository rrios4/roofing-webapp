import React from 'react';
import { Flex, Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { RefreshCcw, MoreHorizontal, Share, FileOutput, ChevronLeft } from 'lucide-react';
import { FiEdit } from 'react-icons/fi';
import { MdOutlinePayments, MdTransform } from 'react-icons/md';
import { AiOutlineBars } from 'react-icons/ai';

const InvoiceDetailsHeader = (props) => {
  const { handleEditInvoiceModal, invoice, onExportPDFOpen } = props;
  return (
    <>
      {/* Header */}
      <Flex justify={'space-between'} mb={'1rem'} flexDir={{ base: 'row', lg: 'row' }}>
        <Flex px={'1rem'} gap={4} mb={{ base: '0rem', lg: '0' }}>
          <Link to={`/invoices`}>
            <Button bg={'white'} border={'1px'} shadow={'xs'} borderColor={'gray.300'}>
              <ChevronLeft size={'15px'} />
            </Button>
          </Link>
          {/* <Text my={'auto'} fontSize={'xl'} fontWeight={'bold'}>INV #{id}</Text> */}
        </Flex>
        <Flex px={'1rem'} gap={4} ml={{ base: 'auto', lg: '0' }}>
          <Menu>
            <MenuButton
              as={Button}
              bg={'white'}
              border={'1px'}
              shadow={'xs'}
              borderColor={'gray.300'}>
              <MoreHorizontal size={'15px'} />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiEdit />} onClick={() => handleEditInvoiceModal(invoice)}>
                Edit Invoice
              </MenuItem>
              <MenuItem icon={<MdOutlinePayments />}>Edit Payments</MenuItem>
              <MenuItem icon={<AiOutlineBars />}>Edit Line Items</MenuItem>
            </MenuList>
          </Menu>
          {/* <Tooltip hasArrow label="More"><Button colorScheme={'gray'}><FiMoreHorizontal/></Button></Tooltip> */}
          {/* <Tooltip hasArrow label="Share">
            <Button colorScheme={'gray'}>
              <FiShare2 />
            </Button>
          </Tooltip> */}
          {/* <Tooltip hasArrow label="Send invoice">
            <Button colorScheme={'blue'} gap={2}>
              <FiSend />
              Send invoice
            </Button>
          </Tooltip> */}
          <Button colorScheme={'blue'} onClick={onExportPDFOpen} gap={2}>
            <FileOutput size={'15px'} />
            Export as PDF
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default InvoiceDetailsHeader;
