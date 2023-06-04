import React from 'react';
import { DeleteAlertDialog } from '../../..';
import { useDeleteCustomer } from '../../../../hooks/useAPI/useCustomers';

const ConnectedCustomerDeleteAlertDialog = (props) => {
  const { toast, itemNumber, isOpen, onClose, header, body, entityDescription } = props;

  // Function that does action to delete customer by id from DB
  const { mutate, isLoading } = useDeleteCustomer(toast);

  const handleModalDeleteOnClick = async () => {
    // mutateDeleteCustomer(itemNumber);
    mutate(itemNumber);
  };

  return (
    <DeleteAlertDialog
      onSubmit={handleModalDeleteOnClick}
      header={header}
      entityDescription={entityDescription}
      body={body}
      onClose={onClose}
      isOpen={isOpen}
      loadingState={isLoading}
    />
  );
};

export default ConnectedCustomerDeleteAlertDialog;
