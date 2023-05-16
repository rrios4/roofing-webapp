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
  Button
} from '@chakra-ui/react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { QuoteDocument } from '../../index.js';
import { formatNumber } from '../../../utils';
import { FileText } from 'lucide-react';

const QuoteDetailsPdfPreviewModal = (props) => {
  const { quoteById, onExportPDFClose, isExportPDFOpen, handlePDFDownload } = props;
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
          <ModalCloseButton />
          <ModalHeader>
            <Flex gap="2">
              <FileText size={'25px'} />
              <Text my="auto" textAlign="middle" align="center">
                PDF Preview
              </Text>
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Flex overflow={'scroll'} justify={'center'}>
              <Fragment>
                <PDFViewer width="700" height="500">
                  <QuoteDocument quote={quoteById} />
                </PDFViewer>
              </Fragment>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex gap="4">
              <PDFDownloadLink
                document={<QuoteDocument quote={quoteById} />}
                fileName={`RR-QT${formatNumber(quoteById?.quote_number)}`}>
                {({ blob, url, loading, error }) =>
                  loading ? (
                    <Button colorScheme="blue" isLoading="true">
                      Generating...
                    </Button>
                  ) : (
                    <Button colorScheme="blue" onClick={() => handlePDFDownload()}>
                      Download
                    </Button>
                  )
                }
              </PDFDownloadLink>
              <Button onClick={onExportPDFClose}>Cancel</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default QuoteDetailsPdfPreviewModal;
