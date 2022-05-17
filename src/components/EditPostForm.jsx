import React, { useState } from "react";
import { BiImageAdd, BiLocationPlus, BiVideo } from "react-icons/bi";
import { MdClose, MdGif } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IconButton, Loader } from ".";
import { useModal } from "../context/modalContext";
import { uploadImages } from "../services/cloudinary/cloudinaryService";
import { createPost, fetchUserFeedPosts } from "../services/posts/postsService";
import { initialPostState } from "../utils";
const EditPostForm = ({ postInfo }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [post, setPost] = useState(postInfo);
  const { setIsModalOpen } = useModal();
  const [imgUrls, setImgUrls] = useState(postInfo?.mediaURLs ?? []);

  const [isLoading, setIsLoading] = useState(false);
  const PhotosSetcion = () => {
    return (
      <div className="p-4 relative bg-slate-200 grid photos  grid-flow-col-dense auto-cols-min gap-4 overflow-auto  w-full">
        {imgUrls.map((mediaURL, index) => (
          <div className=" relative  sm:w-60 w-48" key={mediaURL}>
            <MdClose
              onClick={() => {
                const newImageUrls = imgUrls.filter(
                  (url) => url.url !== mediaURL.url
                );
                const mediaURLs = Array.from(post.mediaURLs).filter(
                  (file) =>
                    file.name !== mediaURL.name &&
                    file.lastModified !== mediaURL.lastModified
                );
                setPost({ ...post, mediaURLs });
                setImgUrls(newImageUrls);
              }}
              className="cursor-pointer p-1 w-8 h-8 rounded-full fill-red-500 bg-white shadow-md absolute -right-1 -top-1"
            />
            <img
              key={index}
              src={mediaURL.url}
              alt="postImage"
              className="cursor-pointer aspect-square    p-1 bg-slate-200    object-cover shadow-sm"
            />
          </div>
        ))}
      </div>
    );
  };
  if (postInfo)
    return (
      <div className="w-full md:p-6 p-4 rounded-lg shadow-lg bg-white   ">
        <div className="relative flex items-center gap-3 mb-3">
          {postInfo && (
            <IconButton
              onClick={() => {
                setIsModalOpen(false);
              }}
              Icon={MdClose}
              className="absolute right-0 top-0 "
            />
          )}
          <Link to={`/profile/${user?._id}`}>
            <img
              className=" shadow-sm cursor-pointer rounded-full w-10 h-10 "
              src={user.profilePictureURL}
              alt={user.name}
            />
          </Link>
          <span className="text-lightBlue">{user.name}</span>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            if (Array.from(post.mediaURLs).length > 0) {
              const urls = await uploadImages(post.mediaURLs, user._id);

              const _post = {
                content: post.content,
                mediaURLs: urls.map((url) => ({
                  url,
                  type: "image",
                })),
                id: user._id,
              };
              dispatch(createPost(_post));
              setImgUrls([]);
              setIsLoading(false);

              setPost(initialPostState);
            } else {
              dispatch(createPost({ ...post, id: user._id }));
              setImgUrls([]);
              setIsLoading(false);

              setPost(initialPostState);
            }
            dispatch(fetchUserFeedPosts(user?._id));
          }}
        >
          <div className="form-group mb-6">
            <textarea
              className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        resize-none
        border-b-2
        text-gray-700
        bg-white bg-clip-padding
         border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none
      "
              id="post_description"
              rows={3}
              placeholder="Hey, what's on your mind?"
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
            />
            {imgUrls.length > 0 && <PhotosSetcion />}
          </div>

          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex gap-2 items-center">
              <div className="">
                <label htmlFor="file">
                  <IconButton Icon={BiImageAdd} />
                </label>
                <input
                  id="file"
                  style={{ display: "none" }}
                  type={"file"}
                  multiple={true}
                  accept="image/*"
                  onChange={(e) => {
                    setPost({ ...post, mediaURLs: e.target.files });
                    Array.from(e.target.files).forEach((file) => {
                      setImgUrls((prevImgUrls) => [
                        ...prevImgUrls,
                        {
                          name: file.name,
                          lastModified: file.lastModified,
                          url: URL.createObjectURL(file),
                        },
                      ]);
                    });
                  }}
                />
              </div>
              <IconButton Icon={MdGif} />
              <IconButton Icon={BiVideo} />
              <IconButton Icon={BiLocationPlus} />
            </div>
            {!isLoading ? (
              <button
                type="submit"
                disabled={post.content.length === 0 && imgUrls.length === 0}
                className={`
      w-full
      md:w-auto
      px-6
      py-2.5
      ${
        post.content.length === 0 && imgUrls.length === 0 && !isLoading
          ? "bg-slate-400"
          : "bg-primary"
      }
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-primary-700 hover:shadow-lg
      focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-primary-800 active:shadow-lg
      transition
      duration-150
      ease-in-out`}
              >
                Post
              </button>
            ) : (
              <Loader type="mini" />
            )}
          </div>
        </form>
      </div>
    );
};

export default EditPostForm;
