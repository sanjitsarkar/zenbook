import React, { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Modal } from "../../components";
import { updateUser } from "../../features/auth/authSlice";
import { updateProfile } from "../../features/profile/profileSlice";
import { followUser, unfollowUser } from "../../services/auth/authService";
import { COVER_PHOTO_PLACEHOLDER, PROFILE_PIC_PLACEHOLDER } from "../../utils";
import { ProfileEditForm } from "./ProfileEditForm";

export const ProfileHeader = ({ profile }) => {
  const postCount = useSelector(
    (state) => state.userCreatedPosts?.data?.length
  );
  const [isEditProfile, setIsEditProfile] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const isFollowing = user?.following.includes(profile?._id);
  const isFollower = user?.followers.includes(profile?._id);
  return (
    <div className="flex flex-col   bg-white  ">
      {isEditProfile && (
        <Modal>
          <ProfileEditForm
            profileInfo={profile}
            setIsEditProfile={setIsEditProfile}
          />
        </Modal>
      )}
      <img
        className="sm:h-40 h-32 object-cover"
        src={profile.coverPictureURL ?? COVER_PHOTO_PLACEHOLDER}
        alt={profile.name}
      />
      <div className="flex flex-col p-6 ">
        <div className=" justify-center h-fit sm:justify-start  items-center     flex flex-wrap  ">
          <img
            className="sm:w-32 w-28 h-28 sm:h-32 rounded-full border-8 shadow-sm aspect-square border-white object-cover relative bottom-14 sm:bottom-16   left-6  "
            src={profile.profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
            alt={profile.name}
          />
          <BiEditAlt
            onClick={() => {
              setIsEditProfile(true);
            }}
            className="cursor-pointer relative md:bottom-8  bottom-8 right-6 p-2 w-10 h-10 rounded-full shadow-md bg-lightBlue fill-white"
          />

          <div className="sm:ml-6 -mt-14   flex   flex-wrap  md:gap-10  gap-4 justify-around items-center">
            <div className="flex flex-col  items-center gap-2">
              <h1 className=" text-xl  text-lightBlue">{profile.name}</h1>
              {user?._id !== profile?._id && !isFollowing && (
                <button
                  onClick={() => {
                    dispatch(
                      followUser({
                        followingId: profile?._id,
                        followerId: user._id,
                      })
                    );

                    const newUser = {
                      ...user,
                      following: [...user.following, profile?._id],
                    };
                    const newProfile = {
                      ...profile,
                      followers: [...profile.followers, user?._id],
                    };
                    dispatch(updateProfile({ profile: newProfile }));
                    dispatch(updateUser({ user: newUser }));
                  }}
                  className="px-4 rounded-full py-1.5 bg-primary text-white "
                >
                  Follow {isFollower ? "Back" : ""}
                </button>
              )}
              {user?._id !== profile?._id && isFollowing && (
                <button
                  onClick={() => {
                    dispatch(
                      unfollowUser({
                        followingId: profile?._id,
                        followerId: user._id,
                      })
                    );
                    const _user = user;
                    const newUser = {
                      ...user,
                      following: _user.following.filter(
                        (id) => id !== profile?._id
                      ),
                    };
                    const _profile = profile;
                    const newProfile = {
                      ...profile,
                      followers: _profile.followers.filter(
                        (id) => id !== user?._id
                      ),
                    };
                    dispatch(updateProfile({ profile: newProfile }));
                    dispatch(updateUser({ user: newUser }));
                  }}
                  className="px-4 rounded-full py-1.5 bg-primary text-white "
                >
                  Unfollow
                </button>
              )}
            </div>
            <div className="flex  sm:mt-1 sm:gap-6 gap-4 text-lightBlue flex-wrap items-center justify-center ">
              <h1>
                <span className="font-semibold mr-2">{postCount}</span> post
                {postCount > 1 ? "s" : ""}
              </h1>
              <Link to={`/users/${profile._id}/followers`}>
                <span className="font-semibold mr-2">
                  {profile.followers.length}
                </span>
                follower{profile.followers.length > 1 ? "s" : ""}
              </Link>
              <Link to={`/users/${profile._id}/following`}>
                <span className="font-semibold mr-2">
                  {profile.following.length}
                </span>
                following
              </Link>
            </div>
          </div>
        </div>

        <div className="sm:ml-6 sm:-mt-10     flex flex-col gap-1 sm:text-left text-center flex-wrap   text-lightBlue">
          {profile.bio && (
            <p className="text-lightBlue text-opacity-95">
              {profile.bio ??
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis,earum."}
            </p>
          )}
          {profile.portfolioUrl && (
            <a
              className="sm:w-max text-primary"
              href={profile.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {profile.portfolioUrl}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
