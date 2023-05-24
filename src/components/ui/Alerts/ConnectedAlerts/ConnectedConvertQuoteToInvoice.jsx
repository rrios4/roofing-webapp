import React from 'react';
import ActionModal from '../../Modals/ActionModal';

const ConnectedConvertQuoteToInvoice = (props) => {
  const { isOpen, onClose, initialRef, finalRef, header } = props;
  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      initialRef={initialRef}
      finalRef={finalRef}
    />
  );
};

export default ConnectedConvertQuoteToInvoice;
