import React, { useEffect, useState } from "react";
import { MdSend } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ReplySection } from ".";
import { addReply, fetchAllReply } from "../services/replies/repliesService";
import { PROFILE_PIC_PLACEHOLDER } from "../utils";
export const CommentSection = ({ commentInfo, postedBy }) => {
  const user = useSelector((state) => state.auth?.user);
  const replies = useSelector((state) => state.replies?.data);
  const {
    comment,
    commentedBy: { _id: id, profilePictureURL, name },
  } = commentInfo;
  const [reply, setReply] = useState("");
  const dispatch = useDispatch();
  const [showReplyInput, setShowReplyInput] = useState(false);
  useEffect(() => {
    dispatch(fetchAllReply(commentInfo._id));
  }, [commentInfo, dispatch]);
  return (
    <div className="flex flex-wrap  gap-2 item-center  ">
      <Link to={`/profile/${id}`}>
        <img
          className=" shadow-sm cursor-pointer rounded-full w-8 h-8 "
          src={profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
          alt="profilePicture"
        />
      </Link>
      <div className="flex flex-col gap-1 w-full sm:min-w-max ">
        <div className="flex flex-col bg-lightBlue bg-opacity-5 p-2.5 rounded-md">
          <span className="text-lightBlue">{name}</span>
          <span className="text-sm text-lightBlue text-opacity-70">
            {comment}
          </span>
        </div>

        <span
          className="cursor-pointer w-max text-sm text-lightBlue"
          onClick={() => {
            setShowReplyInput(!showReplyInput);
          }}
        >
          Reply
        </span>

        <div className="flex flex-col gap-2 ml-4">
          {replies?.map(
            (reply) =>
              reply &&
              reply.commentId === commentInfo._id && (
                <ReplySection replyInfo={reply} key={reply._id} />
              )
          )}
        </div>

        {showReplyInput && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(
                addReply({
                  reply,
                  repliedBy: user?._id,
                  commentId: commentInfo._id,
                })
              );
              setReply("");
            }}
            className="flex flex-wrap items-center gap-3 my-4 ml-2"
          >
            <Link to={`/profile/${id}`}>
              <img
                className=" shadow-sm cursor-pointer rounded-full w-8 h-8 "
                src={profilePictureURL ?? PROFILE_PIC_PLACEHOLDER}
                alt="profilePicture"
              />
            </Link>

            <input
              type="text"
              name=""
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={`Reply to ${postedBy.name}`}
              id=""
              className="px-2.5 h-auto py-1 outline-none  ease-in-out transition-all bg-lightBlue bg-opacity-5 focus-within:bg-opacity-5 focus-within:border-opacity-50 border border-transparent focus-within:border-primary  w-full sm:w-4/5  rounded-md "
            />
            <button
              type="submit"
              className="px-2.5 py-1.5 bg-primary justify-self-end text-white flex items-center gap-2 rounded-full"
            >
              <span className="text-sm cursor-pointer">Reply</span>
              <MdSend size={15} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
