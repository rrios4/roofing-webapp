import React from 'react'
import { Box } from "@chakra-ui/react";

const index = (props) => {
  const { variant, children, width, ...rest } = props;
  return (
    <Box padding={'20px'} display='flex' flexDirection='column' width={width} position='relative' borderRadius='xl' minWidth='0px' shadow='md' border={'1px'} borderColor='gray.100'>
      {children}
    </Box>
  )
}

export default index