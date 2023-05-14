import React from 'react';
import {
  Card,
  CardBody,
  Menu,
  Flex,
  MenuButton,
  Box,
  MenuList,
  MenuItem,
  Tooltip,
  Text,
  Button,
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
  CheckCircle
} from 'lucide-react';

const QuoteDetailsQuickAction = (props) => {
  const {
    loadingQuoteStatusIsOn,
    handleQuoteStatusMenuSelection,
    onAddLineItemOpen,
    editSwitchIsOn,
    setEditSwitchIsOn,
    quoteById
  } = props;
  return (
    <>
      <Card rounded={'xl'} size={'sm'}>
        <CardBody>
          <Flex px={'8px'} gap={2}>
            {/* <Text fontSize={'2xl'} fontWeight={'bold'}>${formatMoneyValue(quoteById?.amount_due)}</Text> */}
            {/* Menu Button to update status of invoice */}
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    w="full"
                    isLoading={loadingQuoteStatusIsOn}
                    isActive={isOpen}
                    as={Button}
                    rightIcon={
                      isOpen ? <ChevronDown size={'15px'} /> : <ChevronUp size={'15px'} />
                    }>
                    {quoteById?.quote_status?.name === 'Draft' ? (
                      <>
                        <Flex gap="2">
                          <Box my="auto">
                            <FolderEdit size={'15px'} />
                          </Box>
                          {quoteById?.quote_status?.name}
                        </Flex>
                      </>
                    ) : quoteById?.quote_status?.name === 'Pending' ? (
                      <>
                        <Flex gap="2">
                          <Box my="auto">
                            <Clock size={'15px'} />
                          </Box>
                          {quoteById?.quote_status?.name}
                        </Flex>
                      </>
                    ) : quoteById?.quote_status?.name === 'Accepted' ? (
                      <>
                        <Flex gap="2">
                          <Box my="auto">
                            <CheckCircle size={'15px'} />
                          </Box>
                          {quoteById?.quote_status?.name}
                        </Flex>
                      </>
                    ) : quoteById?.quote_status?.name === 'Rejected' ? (
                      <>
                        <Flex gap="2">
                          <Box my="auto">
                            <Ban size={'15px'} />
                          </Box>
                          {quoteById?.quote_status?.name}
                        </Flex>
                      </>
                    ) : (
                      <></>
                    )}
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => handleQuoteStatusMenuSelection(4)}>
                      <Flex gap="2">
                        <Box my="auto">
                          <FolderEdit size={'15px'} />
                        </Box>
                        <Text>Draft</Text>
                        {quoteById?.quote_status?.name === 'Draft' ? (
                          <Box my="auto" ml="1rem">
                            <Check size="15px" />
                          </Box>
                        ) : (
                          <></>
                        )}
                      </Flex>
                    </MenuItem>
                    <MenuItem onClick={() => handleQuoteStatusMenuSelection(1)}>
                      <Flex gap="2">
                        <Box my="auto">
                          <CheckCircle size="15px" />
                        </Box>
                        <Text>Accepted</Text>
                        {quoteById?.quote_status?.name === 'Accepted' ? (
                          <Box my="auto" ml="1rem">
                            <Check size={'15px'} />
                          </Box>
                        ) : (
                          <></>
                        )}
                      </Flex>
                    </MenuItem>
                    <MenuItem onClick={() => handleQuoteStatusMenuSelection(2)}>
                      <Flex gap="2">
                        <Box my="auto">
                          <Clock size="15px" />
                        </Box>
                        <Text>Pending</Text>
                        {quoteById?.quote_status?.name === 'Pending' ? (
                          <Box my="auto" ml="1rem">
                            <Check size={'15px'} />
                          </Box>
                        ) : (
                          <></>
                        )}
                      </Flex>
                    </MenuItem>
                    <MenuItem onClick={() => handleQuoteStatusMenuSelection(3)}>
                      <Flex gap="2">
                        <Box my="auto">
                          <Ban size="15px" />
                        </Box>
                        <Text>Rejected</Text>
                        {quoteById?.quote_status?.name === 'Rejected' ? (
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
            <Button w={'full'} onClick={onAddLineItemOpen}>
              Add Line Item
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

export default QuoteDetailsQuickAction;
