import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom";


const Schedules = () => {
    const history = useHistory();
    useEffect(() => {
        // if a user is logged in, their username will be in Local Storage as 'currentUser' until they log out.
        if (!localStorage.getItem('currentUser')) {
            history.push('/login');
        }
    }, []);
    return (
        <div>
            
        </div>
    )
}

export default Schedules
