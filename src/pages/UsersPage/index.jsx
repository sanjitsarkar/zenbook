import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { Layout, Loader } from "../../components";
import { useSearch } from "../../context";
import {
  followUser,
  getFollowers,
  getFollowing,
  searchUsers,
  unfollowUser,
} from "../../services/auth/authService";
import { PROFILE_PIC_PLACEHOLDER } from "../../utils";

export const UsersPage = ({ type }) => {
  const dispatch = useDispatch();
  const { profileId } = useParams();
  let search = useLocation().search;
  search = new URLSearchParams(search).get("search");
  const { skip, setSkip } = useSearch();
  const [users, setUsers] = useState([]);
  const followers = useSelector((state) => state.followers);
  const following = useSelector((state) => state.following);
  const user = useSelector((state) => state.auth?.user);
  const searchedUsers = useSelector((state) => state.searchedUsers);
  const isFollowing = (id) => user?.following.includes(id);
  const isFollower = (id) => user?.followers.includes(id);
  const observer = useRef();
  const loaderRef = useCallback(
    (node) => {
      if (searchedUsers.status === "loading") return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setSkip(searchedUsers.data.length);
        }
      });
      if (node) observer.current.observe(node);
    },
    [searchedUsers]
  );
  useEffect(() => {
    if (type === "followers") {
      dispatch(getFollowers(profileId));
    } else if (type === "following") {
      dispatch(getFollowing(profileId));
    } else if (type === "search") {
      dispatch(searchUsers({ search, skip }));
    }
    setUsers([]);
  }, [skip, search]);

  useEffect(() => {
    if (type === "search") {
      setUsers(searchedUsers?.data);
    }
    if (type === "followers") {
      setUsers(followers?.data);
    } else if (type === "following") {
      setUsers(following?.data);
    }
  }, [followers, following, searchedUsers]);

  return (
    <Layout>
      <h1 className="text-lightBlue text-center  mt-8 text-xl font-semibold">
        {type !== "search" ? (
          type[0].toUpperCase() + type.substr(1)
        ) : (
          <>
            <span className="text-lightBlue font-medium">
              Search Results for
            </span>{" "}
            <span className="text-lightBlue text-opacity-80">{search}</span>
          </>
        )}
      </h1>
      <div className="flex flex-col gap-4 justify-center items-center mt-5">
        {(searchedUsers.status !== "loading" ||
          followers.status !== "loading" ||
          following.status !== "loading") &&
          users.length === 0 && (
            <span className="text-center text-lg mt-2 font-medium text-lightBlue">
              No {type === "search" ? "users" : type} found
            </span>
          )}
        <div className="flex flex-col gap-2   ">
          {users.length > 0 &&
            users.map((_user, i) => {
              if (i === users.length - 1)
                return (
                  <div
                    ref={loaderRef}
                    key={_user._id}
                    className="p-4 sm:gap-8 gap-4 rounded-md flex flex-wrap   shadow-md justify-between sm:items-center min-w-96   bg-white"
                  >
                    <Link
                      to={`/profile/${_user._id}`}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={_user.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
                        alt="avatar"
                        className="rounded-full w-12 h-12 mr-4"
                      />
                      <h3 className="text-xl text-lightBlue">{_user.name}</h3>
                    </Link>
                    {_user._id !== user?._id && isFollowing(_user._id) && (
                      <button
                        onClick={() => {
                          dispatch(
                            unfollowUser({
                              followingId: _user._id,
                              followerId: user?._id,
                            })
                          );
                        }}
                        className="bg-primary text-white rounded-full px-4 py-2"
                      >
                        Unfollow
                      </button>
                    )}
                    {_user._id !== user?._id && !isFollowing(_user._id) && (
                      <button
                        onClick={() => {
                          dispatch(
                            followUser({
                              followingId: _user._id,
                              followerId: user?._id,
                            })
                          );
                        }}
                        className="bg-primary text-white rounded-full px-4 py-2"
                      >
                        Follow {isFollower ? "Back" : ""}
                      </button>
                    )}
                  </div>
                );
              return (
                <div
                  key={_user._id}
                  className="p-4 sm:gap-8 gap-4 rounded-md flex flex-wrap   shadow-md sm:justify-between sm:items-center min-w-96   bg-white"
                >
                  <Link
                    to={`/profile/${_user._id}`}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={_user.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
                      alt="avatar"
                      className="rounded-full w-12 h-12 mr-4"
                    />
                    <h3 className="text-xl text-lightBlue">{_user.name}</h3>
                  </Link>
                  {_user._id !== user?._id && isFollowing(_user._id) && (
                    <button
                      onClick={() => {
                        dispatch(
                          unfollowUser({
                            followingId: _user._id,
                            followerId: user?._id,
                          })
                        );
                      }}
                      className="bg-primary text-white rounded-full px-4 py-2"
                    >
                      Unfollow
                    </button>
                  )}
                  {_user._id !== user?._id && !isFollowing(_user._id) && (
                    <button
                      onClick={() => {
                        dispatch(
                          followUser({
                            followingId: _user._id,
                            followerId: user?._id,
                          })
                        );
                      }}
                      className="bg-primary text-white rounded-full px-4 py-2"
                    >
                      Follow {isFollower ? "Back" : ""}
                    </button>
                  )}
                </div>
              );
            })}
          {(searchedUsers.status === "loading" ||
            followers.status === "loading" ||
            following.status === "loading") && <Loader type="medium" />}
        </div>
      </div>
    </Layout>
  );
};
