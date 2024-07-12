import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();
const SearchProvider = ({ children, val }) => {
  const [search, setSearch] = useState(val ?? "");
  const [skip, setSkip] = useState(0);
  return (
    <SearchContext.Provider value={{ search, setSearch, skip, setSkip }}>
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = (val) => useContext(SearchContext, val);
export { useSearch, SearchProvider };
