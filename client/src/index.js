import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from './components/Authentication/auth';
import { ColorModeScript, ThemeProvider, ChakraProvider, CSSReset } from '@chakra-ui/react';
import theme from './theme'

import App from './App';

ReactDOM.render(
    <>
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <CSSReset />
                <ChakraProvider>
                <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                <App />
                </ChakraProvider>
            </ThemeProvider>
        </AuthProvider>
    </>
, document.getElementById('root'));