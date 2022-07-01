import React from 'react'
import { Box } from "@chakra-ui/react";

const index = (props) => {
  const { variant, children, width, bg, borderColor, ...rest } = props;
  return (
    <Box bg={bg} padding={'20px'} display='flex' flexDirection='column' width={width} position='relative' borderRadius='xl' minWidth='0px' shadow='sm' border={'1px'} borderColor={borderColor}>
      {children}
    </Box>
  )
}

export default index