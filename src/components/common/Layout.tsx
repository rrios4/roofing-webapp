import React from 'react';
import SideNavbar from './side-navbar';

type Props = {
  props: React.ReactNode;
}

const Layout = (props: Props) => {
  // const bg = useColorModeValue('#fcfcfd', 'gray.800');
  return (
    <>
      <header>
        <SideNavbar />
      </header>
      <div className="flex justify-center lg:ml-[5rem] p-4">
        <div className="flex w-full min-h-screen lg:mt-[0rem] justify-center max-w-screen">
          {props.children}
        </div>
      </div>
    </>
  );
};

export default Layout;
