import React from 'react';
import SideNavbar from './side-navbar.tsx';

const Layout = (props) => {
  // const bg = useColorModeValue('#fcfcfd', 'gray.800');
  return (
    <>
      <header>
        <SideNavbar />
      </header>
      <div className="flex justify-center lg:pl-[6rem]">
        <div className="flex w-full min-h-screen mt-[4rem] lg:mt-[0rem] justify-center max-w-2xl">
          {props.children}
        </div>
      </div>
    </>
  );
};

export default Layout;
