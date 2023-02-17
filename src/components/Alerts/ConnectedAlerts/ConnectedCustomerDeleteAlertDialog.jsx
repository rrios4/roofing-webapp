// import React from 'react';
// import { DeleteAlertDialog } from './DeleteAlertDialog';
// import supabase from '../../utils/supabaseClient';

// export const ConnectedCustomerDeleteAlertDialog = (props) => {
//   const { toast, itemNumber, updateParentState, loadingState, isOpen, onClose } = props;
//   const handleSubmit = async () => {
//     const { error } = await supabase.from('customer').delete().eq('id', itemNumber);

//     if (error) {
//       console.log(error);
//       toast({
//         position: `top`,
//         title: `Error Deleting Customer #${itemNumber} occured!`,
//         description: `Error: ${error.message}`,
//         status: 'error',
//         duration: 5000,
//         isClosable: true
//       });
//     }
//   };

//   return (
//     <DeleteAlertDialog
//       onSubmit={handleSubmit}
//       body={
//         'This will delete the information of the customer. Are you sure you want to delete them. 🤔'
//       }
//       isOpen={isOpen}
//       onClose={onClose}
//       itemNumber={itemNumber}
//       updateParentState={updateParentState}
//       loadingState={loadingState}
//     />
//   );
// };
