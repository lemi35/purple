import "./home.scss";
import { useEffect, useState } from "react";
import Posts from "../../components/posts/Posts";
import PostCreate from "../../components/postCreate/PostCreate";
import PostType from "../../types/PostType";
//import UserType from "../../types/UserType";
import axios from "axios";

interface PostWithUser extends PostType {
  user: {
    username: string;
    profileImage?: string;
  };
}

const Home = () => {
  const baseurl = import.meta.env.VITE_API_URL;
  //const baseurl = "http://localhost:3001";
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  
  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const posts = await axios.get(`${baseurl}/posts`);
      const sortedPosts = posts.data.sort(
        (
          a: PostWithUser,
          b: PostWithUser, //Sorts data so that the newest post is first
        ) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error("error fetching posts:", error);
    }
  };

  return (
    <div className="home">
      <PostCreate refreshPosts={getPosts} />
      <h2>Feed</h2>
      <Posts posts={posts} refreshPosts={getPosts} />
    </div>
  );
};

export default Home;
