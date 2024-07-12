import React from "react";

export const Modal = ({ children }) => {
  return (
    <div className="grid place-content-center w-screen h-screen z-50 bg-lightBlue bg-opacity-80  fixed top-0 left-0 right-0  backdrop-blur-md ">
      {children}
    </div>
  );
};
