import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from './components/Authentication/auth';

import App from './App';

ReactDOM.render(<AuthProvider><App /></AuthProvider>, document.getElementById('root'));