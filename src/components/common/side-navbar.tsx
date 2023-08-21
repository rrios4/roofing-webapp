import React from 'react';

type Props = {};

export default function SideNavbar({}: Props) {
  return (
    <>
        {/* Desktop */}
      <div className="hidden z-1 fixed w-full h-[5rem] rounded-tr-none rounded-br-none shadow-xs p-0 m-0 t-0 border-r-1 lg:w-[80px] lg:h-screen lg:flex lg:flex-col bg-red-100">
        <div className="mx-auto my-4 h-screen"></div>
      </div>
    </>
  );
}
