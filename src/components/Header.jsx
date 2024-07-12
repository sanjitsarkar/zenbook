import React, { useEffect, useState } from "react";
import { BiBell, BiSearch } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { MdClose, MdMenu } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LOGO from "../assets/logo.png";
import { useSearch } from "../context";
import { logout } from "../features/auth/authSlice";
import { clearSearchedUsers } from "../features/searchedUsers/searchedUsersSlice";
import { PROFILE_PIC_PLACEHOLDER } from "../utils";
export const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const { search, setSearch, setSkip } = useSearch();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!location.pathname.includes("users")) {
      setSearch("");
    }
  }, [location.pathname]);
  return (
    <header className="fixed z-20  left-0 right-0 top-0 text-dark justify-between bg-white py-4 px-6 shadow-md flex items-center">
      <div className="left flex items-center gap-3">
        {!isNavOpen ? (
          <MdMenu
            className="cursor-pointer rounded-full p-2 w-10 h-10 shadow-md  sm:hidden"
            onClick={() => setIsNavOpen(true)}
          />
        ) : (
          <MdClose
            className="cursor-pointer rounded-full p-2 w-10 h-10 shadow-md sm:hidden"
            onClick={() => setIsNavOpen(false)}
          />
        )}
        <Link
          to="/"
          className="site-title  text-xl sm:flex gap-2 items-center hidden "
        >
          <img src={LOGO} alt="ZenGram" className="w-10" />
          <h4>
            Zen
            <span className="text-primary">Gram</span>
          </h4>
        </Link>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(clearSearchedUsers());
            setSkip(0);
            navigate("/users?search=" + search);
          }}
          className="input-box ease-in-out transition-all bg-lightBlue bg-opacity-10 focus-within:bg-opacity-5 focus-within:border-opacity-50 border border-transparent focus-within:border-primary sm:w-52 md:w-96  rounded-md flex  items-center"
        >
          <BiSearch className="ml-3  text-xl text-dark" />
          <input
            required
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            name=""
            placeholder="Search something..."
            id=""
            className=" w-full pl-1 pr-3 py-2 outline-none bg-transparent"
          />
        </form>
      </div>
      <div
        className={` right ${
          isNavOpen ? "flex" : "hidden"
        }  sm:flex absolute top-20 sm:h-auto h-auto sm:relative sm:border-none border-2 border-primary sm:top-0 sm:left-0 p-5 sm:p-0   bg-lightBlue sm:bg-transparent left-2 rounded-md sm:rounded-none  flex-col sm:flex-row items-center  gap-4 shadow-lg sm:shadow-none`}
      >
        <BiBell className="w-10 h-10 p-2 md:focus:bg-lightBlue sm:hover:bg-lightBlue sm:focus:text-white sm:hover:text-white transition-all ease-in-out rounded-full shadow-md bg-white focus:text-white hover:text-white hover:bg-transparent focus:bg-transparent text-darkBlue cursor-pointer" />
        <Link to={`/profile/${user?._id}`}>
          <img
            className="shadow-sm cursor-pointer rounded-full w-10 h-10 "
            src={`${
              user.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER
                ? user.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER
                : "https://www.gravatar.com/avatar/94d093eda664addd6e450d7e9881bcad?s=32&d=identicon&r=PG}"
            }`}
            alt={user.name}
          />
        </Link>
        <FiLogOut
          onClick={() => dispatch(logout())}
          className="w-10 h-10 p-2 md:focus:bg-lightBlue sm:hover:bg-lightBlue sm:focus:text-white sm:hover:text-white transition-all ease-in-out rounded-full shadow-md bg-white focus:text-white hover:text-white hover:bg-transparent focus:bg-transparent text-darkBlue cursor-pointer"
        />
      </div>
    </header>
  );
};
