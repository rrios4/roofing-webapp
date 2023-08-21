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
      <div className="flex justify-center lg:ml-[5rem] py-2 px-6">
        <div className="flex w-full lg:mt-[0rem] justify-center max-w-screen">
          {props.children}
        </div>
      </div>
    </>
  );
};

export default Layout;
