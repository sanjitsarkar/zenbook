import React, { useState } from "react";
import { MdSend } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { CommentSection } from ".";
import { addComment } from "../services/comments/commentsService";
import { PROFILE_PIC_PLACEHOLDER } from "../utils";
export const CommentsContainer = ({
  setIsCommentAdded,
  comments,
  profilePictureURL,
  userId,
  postId,
  postedBy,
}) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  return (
    <div className="flex flex-col gap-1">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(addComment({ comment, commentedBy: userId, postId }));
          setIsCommentAdded(true);
          setComment("");
        }}
        className="flex flex-wrap items-center gap-3 mb-3"
      >
        <Link to={`/profile/${userId}`}>
          <img
            className=" shadow-sm cursor-pointer rounded-full w-8 h-8 "
            src={profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
            alt="profilePicture"
          />
        </Link>

        <input
          type="text"
          name=""
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comment something"
          id=""
          className="px-2.5 h-auto py-1 outline-none  ease-in-out transition-all bg-lightBlue bg-opacity-5 focus-within:bg-opacity-5 focus-within:border-opacity-50 border border-transparent focus-within:border-primary sm:w-4/5 w-full   rounded-md "
        />
        <button
          type="submit"
          className="px-2.5 py-1.5 bg-primary text-white flex items-center gap-2 rounded-full"
        >
          <span className="text-sm">Send</span>
          <MdSend size={15} />
        </button>
      </form>
      <div className="flex flex-col gap-2 ml-2">
        {comments.length > 0 &&
          comments.map((comment) => {
            return (
              <CommentSection
                commentInfo={comment}
                postedBy={postedBy}
                key={comment._id}
              />
            );
          })}
      </div>
    </div>
  );
};
