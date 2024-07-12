import React from "react";
import { Layout, PostsSection } from "../../components";
import { AddPostForm } from "./AddPostForm";
import { StorySection } from "./StorySection";

export const HomePage = () => {
  return (
    <Layout>
      <div className="row gap-4 ">
        <div className="flex flex-col gap-8 md:w-5/6 w-full">
          <StorySection />
          <AddPostForm />
          <PostsSection type="userFeed" />
        </div>
      </div>
    </Layout>
  );
};
