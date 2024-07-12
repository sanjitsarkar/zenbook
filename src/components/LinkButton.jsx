import React from "react";
import { Link } from "react-router-dom";

export const LinkButton = ({ to, name }) => {
  return (
    <Link
      to={`/${to}`}
      className="text-primary hover:text-primary focus:text-primary transition duration-200 ease-in-out"
    >
      {name}
    </Link>
  );
};
