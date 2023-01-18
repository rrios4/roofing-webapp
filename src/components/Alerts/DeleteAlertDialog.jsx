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
    const {header, body, isOpen, onClose, leastDestructiveRef, itemId, itemNumber, tableName, toast, updateParentState} = props

    const deleteItem = async() => {
        const { data, error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', itemId)

        if(error){
            console.log(error)
        }
        await updateParentState()
        onClose()
        toast(itemNumber)
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