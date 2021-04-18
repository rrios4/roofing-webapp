import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useHistory } from "react-router-dom";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';



function Login() {

  let history = useHistory();

  useEffect(() => {
    // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
    if (!localStorage.getItem('currentUser')) {
      history.push('/login');
    }
  }, []);

  // Username and password fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // function to authenticate the user based on the login credentials provided
  const handleLogin = async (event) => {
    event.preventDefault();
    const url = ''
    const credentials = {
      name: username,
      password: password
    }
    await axios.post(url, credentials) // <- api endpoint for authentication
    .then((response) => {
      // if response is 'success', put username into the Session/Local Storage AND/OR useContext and then reroute to home dashboard
      // else, throw alert window and break out of function

      // on the following line, 'success' is an actual boolean variable in the backend handler, it will return true if validation was successful or false if validation was unsuccessful
      if (response.data.success) {
        localStorage.setItem('currentUser', username);
        //redirect page to home dashboard
        history.push('/');
        return;
      } else {
        alert('Username and/or Password is incorrect.');
        return;
      }
    })
    .catch(error => console.error(`Error: ${error}`));
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
        <Heading pt='2px' fontSize={'4xl'}>Sign in to your account</Heading>
        <Text fontSize={'lg'} color={'gray.600'}>
          to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
        </Text>
      </Stack>
      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'lg'}
        p={8}>
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input value={username} type="email" />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input value={password} type="password" />
          </FormControl>
          <Stack spacing={10}>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={'end'}
              justify={'space-between'}>
              <Link color={'blue.400'}>Forgot password?</Link>
            </Stack>
            <Button
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
              onClick={handleLogin}>
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  </Flex>
  )
}

export default Login
