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
    const {header, body, isOpen, onClose, leastDestructiveRef, itemId, itemNumber, tableName, tableFieldName, toast, errorToast, updateParentState} = props

    // Logic that deletes item based on the tableName, itemNumber, fieldName props
    const deleteItem = async() => {
        // We delete associated items first to a main table first
        if(tableName === 'invoice') {
            await deletePaymentsByInvoiceNumber()
            await deleteInvoiceLineItems()
        }

        const { data, error } = await supabase
        .from(tableName)
        .delete()
        .eq(tableFieldName, itemNumber)

        if(error){
            console.log(error)
            // Make a toast for displaying error message to the user
            toast('error', 'top-right', '0', `Error deleting ${tableName} #${itemNumber} occured!`, `Error: ${error.message}`)
        }

        // Success toast feedback is called when data is return from supabase client SDK
        if(data){
            toast('success', 'top-right', '0', `Item ${tableName} #${itemNumber} deleted!`, `We've deleted ${tableName} for you 🚀`)
        }

        await updateParentState()
        onClose()
    }

    // Handles the action to all delete payments assiated with the invoice number
    const deletePaymentsByInvoiceNumber = async() => {
        const { data, error } = await supabase
        .from('payment')
        .delete()
        .eq('invoice_id', itemNumber)

        if(error){
            console.log(error)
        }
    }

    // Handles the action to delete all invoice line services associated with the invoice number
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