import React, { useState} from 'react'
import swal from 'sweetalert';
import { FcGoogle } from 'react-icons/fc'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  Image,
  useColorModeValue,
  Divider,
  HStack
} from '@chakra-ui/react';
import { useAuth } from '../Authentication/auth';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const auth = useAuth()
    const navigate = useNavigate()

    // Username and password fields
    const [email, setemail] = useState('')
    const [password, setPassword] = useState('')

    const signup = async(e) => {
        e.preventDefault();
        const signup = await auth.SignUp(email,password)

        if(signup.error){
            swal("Try Again!", signup.error.message, "error");
        } else {
            swal("Account Created!", "You are now signed up!", "success");  
        }

        setPassword(''); setemail('')
    }


    const handleGoogleSignin = async (e) => {
        e.preventDefault()
        const loginWithGoogle = await auth.googleLogin()

        if(loginWithGoogle.error){
          swal("Try Again!", loginWithGoogle.error.message, "error");
          navigate("/login");
          
        }
        // swal("Authenthicated with Google!", "You are now signed in!", "success"); 

    }

  return (
    <Flex
    minH={'100vh'}
    align={'center'}
    justify={'center'}
    >
    <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
      <Stack align={'center'}>
          <Image w='100px' rounded='full' bg='blue.500' src='https://github.com/rrios4/roofing-webapp/blob/main/client/src/assets/LogoRR.png?raw=true'/>
        <Heading pt='2px' fontSize={'4xl'}>Sign up to your account</Heading>
        <Text fontSize={'lg'} color={'gray.600'}>
          to enjoy all of our cool features ✌️
        </Text>
      </Stack>
      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'lg'}
        p={8}>
        <Stack spacing={4}>
          <form onSubmit={signup} >
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input isRequired type='email' value={email} onChange={e => setemail(e.target.value)} />
            </FormControl>
            <FormControl id="password" marginTop='1rem'>
              <FormLabel>Password</FormLabel>
              <Input isRequired value={password} type="password" onChange={e => setPassword(e.target.value)} />
            </FormControl>
          
          <Stack marginTop='1rem'>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={'end'}
              justify={'space-between'}>
            </Stack>
            <Button
              type='submit'
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
              >
              Sign up
            </Button>
            <Link to='/login'>
                <Text fontSize='sm' color='gray.400'>Already have an account?</Text>
            </Link>
          </Stack>
          </form>
          <Flex paddingTop='1rem' justifyContent='center' align='center'>
            <Divider maxW='6rem'/>
              <Text fontSize='sm' color='gray.400' paddingX='1rem'>or register with</Text>
            <Divider maxW='6rem'/>
          </Flex>
          <HStack justify='center' spacing='2rem'>
              <Button colorScheme='gray' variant='outline' leftIcon={<FcGoogle/>} onClick={(e) => handleGoogleSignin(e)}>Google</Button>
              {/* <Button></Button>
              <Button></Button> */}
          </HStack>

        </Stack>
      </Box>
    </Stack>
  </Flex>
  )
}

export default SignUp