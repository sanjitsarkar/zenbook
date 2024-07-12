import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import { PrivateRoute } from "./components";
import { useSideBarItem } from "./context";
import {
  BookmarkedPage,
  ExplorePage,
  HomePage,
  LoginPage,
  MessagePage,
  ProfilePage,
  SearchedPostsPage,
  SignupPage,
  UsersPage,
} from "./pages";
import {
  fetchArchivedPosts,
  fetchBookmarkedPosts,
} from "./services/posts/postsService";
function App() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { setActiveName } = useSideBarItem();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      setActiveName("Home");
    } else {
      let name = location.pathname.split("/")[1];
      name = name.charAt(0).toUpperCase() + name.slice(1);
      setActiveName(name);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchBookmarkedPosts(user?._id));
      dispatch(fetchArchivedPosts(user?._id));
    }
  }, []);
  return (
    <div className="App">
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/bookmarks" element={<BookmarkedPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile/:profileId" element={<ProfilePage />} />
          <Route path="/messages/" element={<MessagePage />} />
          <Route
            path="/users/:profileId/followers"
            element={<UsersPage type="followers" />}
          />
          <Route
            path="/users/:profileId/following"
            element={<UsersPage type="following" />}
          />
          <Route path="/users" element={<UsersPage type="search" />} />
          <Route path="/posts" element={<SearchedPostsPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
