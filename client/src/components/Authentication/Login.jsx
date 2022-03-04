import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
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
  // Username and password fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // function to authenticate the user based on the login credentials provided
  const handleLogin = async (event) => {
    event.preventDefault();
    const url = `http://${process.env.REACT_APP_BASE_URL}:8081/api/auth/login`
    const credentials = {
      username: loginUsername,
      password: loginPassword
    }
    await axios.post(url, credentials) // <- api endpoint for authentication
    .then((response) => {
      // if response is 'success', put username into the Session/Local Storage AND/OR useContext and then reroute to home dashboard
      // else, throw alert window and break out of function

      // on the following line, 'success' is an actual boolean variable in the backend handler, it will return true if validation was successful or false if validation was unsuccessful
      if (response.status === 200) {
        localStorage.setItem('username', response.data.username);
        swal("Logged In!", "You are now logged in!", "success");
        //redirect page to home dashboard
        history.push('/');
        return;
      } else if(response.status === 400) {
        return swal("Try Again!", "Invalid Credentials!", "error");
      }
    })
    .catch(error => {
      console.log(error.response);
      swal("Try Again!", "Invalid Credentials!", "error");
    });

    setLoginPassword('');
    setLoginUsername('');
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
          <form method='POST' onSubmit={handleLogin}>
            <FormControl id="email">
              <FormLabel>Username</FormLabel>
              <Input value={loginUsername} onChange={e => setLoginUsername(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input value={loginPassword} type="password" onChange={e => setLoginPassword(e.target.value)} />
            </FormControl>
          
          <Stack spacing={10}>
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
              onClick={handleLogin}>
              Sign in
            </Button>
          </Stack>
          </form>
        </Stack>
      </Box>
    </Stack>
  </Flex>
  )
}

export default Login
