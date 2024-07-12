import React from "react";

export const DropDownOption = ({ name, onClick, Icon }) => {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 flex gap-2 hover:bg-slate-700 focus:bg-slate-700 ease-in-out transition-colors bg-slate-600 items-center"
    >
      <Icon />
      <span>{name}</span>
    </button>
  );
};
