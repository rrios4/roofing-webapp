import React from 'react';
import SideNavbar from './side-navbar';
import { Toaster } from '../ui/toaster';
import { useAuth } from '../../hooks/useAuth';

type Props = {
  children: React.ReactNode;
}

const Layout = ({children}: Props) => {
  const auth = useAuth()
  const [ loggedInUserData, setLoggedInUserData ] = React.useState({
    avatar_url: '',
    email: '',
    email_verified: false,
    full_name: '',
    iss: '',
    name: '',
    picture: '',
    provider_id: '',
    sub: '',
  });

  React.useEffect(() => {
    fetchLoggedInUserData()
  },[loggedInUserData])
  // const bg = useColorModeValue('#fcfcfd', 'gray.800');
  const fetchLoggedInUserData = async() => {
    if(auth.user){
      setLoggedInUserData(auth.user.user_metadata);
      // console.log(loggedInUserData)
    }
  }
  return (
    <>
      <header>
        <SideNavbar userData={loggedInUserData}/>
      </header>
      <div className="flex justify-center lg:ml-[5rem] py-2 px-6">
        <div className="flex w-full mt-[66px] lg:mt-[0rem] justify-center max-w-screen-3xl">
          {children}
        </div>
        <Toaster/>
      </div>
    </>
  );
};

export default Layout;
