import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { FiBell, FiLogOut } from "react-icons/fi";
import { MdClose, MdMenu } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LOGO from "../assets/logo.png";
import { useSearch, useSocket } from "../context";
import { logout } from "../features/auth/authSlice";
import { clearSearchedUsers } from "../features/searchedUsers/searchedUsersSlice";
import { searchUsers } from "../services/auth/authService";
import { PROFILE_PIC_PLACEHOLDER } from "../utils";
export const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const { search, setSearch, setSkip } = useSearch();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useSocket();
  useEffect(() => {
    if (!location.pathname.includes("users")) {
      setSearch("");
    }
  }, [location.pathname]);
  useEffect(() => {
    socket.on("getNotification", ({ type, sender }) => {
      setNotifications((prev) => [...prev, { type, sender }]);
    });
  }, [socket]);
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
            onChange={(e) => {
              setSearch(e.target.value);
              dispatch(searchUsers());
            }}
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
        <div className="relative">
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 text-xs w-6 h-6 text-center p-1 aspect-square rounded-full bg-lightBlue text-white">
              {notifications.length}
            </span>
          )}
          <FiBell
            onClick={() => {
              setShowNotification(
                (prevShowNotification) => !prevShowNotification
              );
            }}
            className="w-10 h-10 p-2 md:focus:bg-lightBlue sm:hover:bg-lightBlue sm:focus:text-white sm:hover:text-white transition-all ease-in-out rounded-full shadow-md bg-white focus:text-white hover:text-white hover:bg-transparent focus:bg-transparent text-darkBlue cursor-pointer"
          />

          {showNotification && (
            <div className="absolute shadow-2xl rounded-md bg-lightBlue top-14 -right-14 w-max flex flex-col gap-1 text-white ">
              {notifications.map((notification) => (
                <Link
                  onClick={() => setShowNotification(false)}
                  to={
                    (notification.type === "message" &&
                      `/messages/${notification.data}`) ||
                    (notification.type === "follow" &&
                      `/profile/${notification.sender._id}`) ||
                    (notification.type === "like" &&
                      `/posts/${notification.data}`) ||
                    (notification.type === "comment" &&
                      `/posts/${notification.data}`)
                  }
                  className="flex p-3 border-b border-opacity-30 border-white items-center  gap-1"
                >
                  <span className="text-sm">{notification.sender.name}</span>
                  {notification.type === "message" && (
                    <span className="text-xs"> sent you a message</span>
                  )}
                  {notification.type === "follow" && (
                    <span className="text-xs"> followed you</span>
                  )}
                  {notification.type === "comment" && (
                    <span className="text-xs"> commented on your post</span>
                  )}
                  {notification.type === "like" && (
                    <span className="text-xs"> liked your post</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        <FiLogOut
          onClick={() => dispatch(logout())}
          className="w-10 h-10 p-2 md:focus:bg-lightBlue sm:hover:bg-lightBlue sm:focus:text-white sm:hover:text-white transition-all ease-in-out rounded-full shadow-md bg-white focus:text-white hover:text-white hover:bg-transparent focus:bg-transparent text-darkBlue cursor-pointer"
        />
      </div>
    </header>
  );
};
