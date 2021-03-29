import React from 'react';
import Axios from 'axios';
//import {Employees, Navbar, Customers, Estimates, Invoices, Materials, Schedules} from './components';
import Customers from './components/Customers/Customers'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

const App = () => {
    return (
        <div>
            Roofing App
            <Customers />
        </div>
    )
}

export default App
