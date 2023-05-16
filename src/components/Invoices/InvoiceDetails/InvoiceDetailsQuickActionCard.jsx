import React from 'react';
import {
  Card,
  CardBody,
  Flex,
  Menu,
  MenuButton,
  Box,
  MenuList,
  MenuItem,
  Text,
  Button,
  Tooltip,
  IconButton
} from '@chakra-ui/react';
import {
  ChevronDown,
  ChevronUp,
  Folder,
  FolderEdit,
  Check,
  X,
  Edit,
  Ban,
  Clock,
  CheckCircle,
  Plus,
  CalendarX
} from 'lucide-react';

const InvoiceDetailsQuickActionCard = (props) => {
  const {
    handleInvoiceStatusMenuSelection,
    loadingInvoiceStatusIsOn,
    onAddLineItemOpen,
    onAddPaymentOpen,
    setEditSwitchIsOn,
    editSwitchIsOn,
    invoice
  } = props;
  return (
    <>
      <Card rounded={'xl'} size="md">
        <CardBody>
          <Flex gap={2} justify={'center'}>
            {/* <Text fontSize={'2xl'} fontWeight={'bold'}>${formatMoneyValue(invoice?.amount_due)}</Text> */}
            {/* Menu Button to update status of invoice */}
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    isLoading={loadingInvoiceStatusIsOn}
                    isActive={isOpen}
                    as={Button}
                    rightIcon={
                      isOpen ? <ChevronDown size={'15px'} /> : <ChevronUp size={'15px'} />
                    }>
                    {invoice?.invoice_status.name === 'Draft' ? (
                      <>
                        <Flex gap="2" pr="4">
                          <Box my="auto">
                            <FolderEdit size={'15px'} />
                          </Box>
                          {invoice?.invoice_status.name}
                        </Flex>
                      </>
                    ) : invoice?.invoice_status.name === 'Pending' ? (
                      <>
                        <Flex gap="2">
                          <Box my="auto">
                            <Clock size={'15px'} />
                          </Box>
                          {invoice?.invoice_status.name}
                        </Flex>
                      </>
                    ) : invoice?.invoice_status.name === 'Paid' ? (
                      <>
                        <Flex gap="2">
                          <Box my="auto">
                            <CheckCircle size={'15px'} />
                          </Box>
                          {invoice?.invoice_status.name}
                        </Flex>
                      </>
                    ) : invoice?.invoice_status.name === 'Overdue' ? (
                      <>
                        <Flex gap="2">
                          <Box my="auto">
                            <Ban size={'15px'} />
                          </Box>
                          {invoice?.invoice_status.name}
                        </Flex>
                      </>
                    ) : (
                      <></>
                    )}
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => handleInvoiceStatusMenuSelection(4)}>
                      <Flex gap="2">
                        <Box my="auto">
                          <FolderEdit size={'15px'} />
                        </Box>
                        <Text>Draft</Text>
                        {invoice?.invoice_status.name === 'Draft' ? (
                          <Box my="auto" ml="1rem">
                            <Check size="15px" />
                          </Box>
                        ) : (
                          <></>
                        )}
                      </Flex>
                    </MenuItem>
                    <MenuItem onClick={() => handleInvoiceStatusMenuSelection(1)}>
                      <Flex gap="2">
                        <Box my="auto">
                          <CheckCircle size="15px" />
                        </Box>
                        <Text>Paid</Text>
                        {invoice?.invoice_status.name === 'Paid' ? (
                          <Box my="auto" ml="1rem">
                            <Check size={'15px'} />
                          </Box>
                        ) : (
                          <></>
                        )}
                      </Flex>
                    </MenuItem>
                    <MenuItem onClick={() => handleInvoiceStatusMenuSelection(2)}>
                      <Flex gap="2">
                        <Box my="auto">
                          <Clock size="15px" />
                        </Box>
                        <Text>Pending</Text>
                        {invoice?.invoice_status.name === 'Pending' ? (
                          <Box my="auto" ml="1rem">
                            <Check size={'15px'} />
                          </Box>
                        ) : (
                          <></>
                        )}
                      </Flex>
                    </MenuItem>
                    <MenuItem onClick={() => handleInvoiceStatusMenuSelection(3)}>
                      <Flex gap="2">
                        <Box my="auto">
                          <CalendarX size={'15px'} />
                        </Box>
                        <Text>Overdue</Text>
                        {invoice?.invoice_status.name === 'Overdue' ? (
                          <Box my="auto" ml="1rem">
                            <Check size={'15px'} />
                          </Box>
                        ) : (
                          <></>
                        )}
                      </Flex>
                    </MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
            <Button leftIcon={<Plus size={'15px'} />} onClick={onAddLineItemOpen}>
              Line-item
            </Button>
            <Button leftIcon={<Plus size={'15px'} />} onClick={onAddPaymentOpen}>
              Payment
            </Button>
            <Tooltip hasArrow label="Edit">
              <IconButton
                icon={editSwitchIsOn === true ? <X size={'15px'} /> : <Edit size={'15px'} />}
                onClick={() => setEditSwitchIsOn(!editSwitchIsOn)}
              />
            </Tooltip>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};

export default InvoiceDetailsQuickActionCard;
