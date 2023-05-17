import React, { Fragment } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  Flex,
  Text,
  ModalBody,
  ModalFooter,
  Button,
  Box
} from '@chakra-ui/react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { InvoiceDocument } from '../../index.js';
import { FileText } from 'lucide-react';

const InvoiceDetailsPreviewPDFModal = (props) => {
  const { invoice, onExportPDFClose, isExportPDFOpen, handleDownloadPDFButton } = props;
  return (
    <>
      <Modal
        onClose={onExportPDFClose}
        isOpen={isExportPDFOpen}
        size={{ base: 'full', md: 'md' }}
        isCentered
        motionPreset="scale">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex gap="2">
              <Box my="auto">
                <FileText size={'25px'} />
              </Box>
              <Text>Invoice Preview</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex overflow={'scroll'} justify={'center'}>
              <Fragment>
                <PDFViewer width="700" height="500">
                  <InvoiceDocument invoice={invoice} />
                </PDFViewer>
              </Fragment>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex gap="4">
              <Button colorScheme="blue" onClick={() => handleDownloadPDFButton()}>
                <PDFDownloadLink
                  document={<InvoiceDocument invoice={invoice} />}
                  fileName={`INV-${invoice?.invoice_number}`}>
                  {({ blob, url, loading, error }) =>
                    loading ? 'Loading document...' : 'Download'
                  }
                </PDFDownloadLink>
              </Button>
              {/* <Button colorScheme="blue">
                <a href={instance.url} download="test.pdf">
                  Download
                </a>
              </Button> */}
              <Button onClick={onExportPDFClose}>Cancel</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InvoiceDetailsPreviewPDFModal;
