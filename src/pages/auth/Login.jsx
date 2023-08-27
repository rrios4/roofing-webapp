import React, { useState } from 'react';
import swal from 'sweetalert';
import { FcGoogle } from 'react-icons/fc';
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
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate, Navigate } from 'react-router-dom';
//import { Link } from 'react-router-dom'

function Login() {
  const auth = useAuth();
  const navigate = useNavigate();

  // Username and password fields
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    const signIn = await auth.Login(email, password);

    if (signIn.error) {
      swal('Try Again!', signIn.error.message, 'error');
      navigate('/login');
    } else {
      swal('Logged In!', 'You are now logged in!', 'success');
    }

    setemail('');
    setPassword('');
  };

  const handleGoogleSignin = async (e) => {
    e.preventDefault();
    const loginWithGoogle = await auth.googleLogin();

    if (loginWithGoogle.error) {
      swal('Try Again!', loginWithGoogle.error.message, 'error');
      navigate('/login');
    } else {
      navigate('/');
    }
  };

  return (
    <Flex>
      <Stack
        spacing={8}
        mx={'auto'}
        maxW={'lg'}
        px={6}
        pb={'16rem'}
        minH={'100vh'}
        justify={'center'}>
        <Stack align={'center'}>
          <Image
            w={{ base: '80px', lg: '100px' }}
            rounded="30"
            bg="blue.500"
            src="/assets/LogoRR.png"
          />
          <Heading pt="1" fontSize={{ base: '3xl', lg: '4xl' }}>
            Sign in to your account
          </Heading>
          <Text fontSize={{ base: 'md', lg: 'md' }} color={'gray.600'} textAlign={'center'}>
            Welcome to "The Roofing App" to empower your roofing business. 🚀
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'xs'}
          border={'1px'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          p={4}>
          <Stack spacing={4}>
            {/* <form onSubmit={handleSignIn}>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input
                  isRequired
                  type="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  isRequired
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              <Stack marginTop="1rem">
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'end'}
                  justify={'space-between'}></Stack>
                <Button
                  type="submit"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500'
                  }}>
                  Sign in
                </Button>
                <Link to="/signup">
                  <Text fontSize="sm" color="gray.400">
                    Dont have an account?
                  </Text>
                </Link>
              </Stack>
            </form> */}
            {/* <Flex paddingTop="1rem" justifyContent="center" align="center">
              <Divider maxW="6rem" />
              <Text fontSize="sm" color="gray.400" paddingX="1rem">
                or continue with
              </Text>
              <Divider maxW="6rem" />
            </Flex> */}
            <HStack justify="center" spacing="2rem">
              <form onSubmit={handleGoogleSignin}>
                <Button
                  type="submit"
                  colorScheme="gray"
                  variant="outline"
                  leftIcon={<FcGoogle />}
                  size={'lg'}>
                  Google
                </Button>
              </form>
            </HStack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Login;
