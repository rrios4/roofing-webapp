import React from 'react';
import supabase from '../../utils/supabaseClient';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button
} from '@chakra-ui/react';

const DeleteAlertDialog = (props) => {
    const {header, body, isOpen, onClose, leastDestructiveRef, itemId, itemNumber, tableName, toast, errorToast, updateParentState} = props

    const deleteItem = async() => {
        const { data, error } = await supabase
        .from(tableName)
        .delete()
        .eq('invoice_number', itemNumber)

        if(error){
            console.log(error)
            // errorToast(itemNumber, error)

        }
        await deletePaymentsByInvoiceNumber()
        await deleteInvoiceLineItems()
        await updateParentState()
        onClose()
        toast(itemNumber)
    }

    const deletePaymentsByInvoiceNumber = async() => {
        const { data, error } = await supabase
        .from('payment')
        .delete()
        .eq('invoice_id', itemNumber)

        if(error){
            console.log(error)
        }
    }

    const deleteInvoiceLineItems = async() => {
        const { data, error } = await supabase
        .from('invoice_line_service')
        .delete()
        .eq('invoice_id', itemNumber)

        if(error){
            console.log(error)
        }
    }

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}  motionPreset='scale'>
        <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>  
                    {header}
                </AlertDialogHeader>

                <AlertDialogBody>
                    {body}
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button colorScheme={'red'} onClick={deleteItem} ml={3}>Delete</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default DeleteAlertDialog