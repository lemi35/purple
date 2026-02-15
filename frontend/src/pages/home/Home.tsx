import "./home.scss";
import { useEffect, useState } from "react";
import Posts from "../../components/posts/Posts";
import PostCreate from "../../components/postCreate/PostCreate";
import PostType from "../../types/PostType";
import UserType from "../../types/UserType";
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
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  
  useEffect(() => {
    fetchCurrentUser();
    getPosts();
  }, []);


  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${baseurl}/users/me`, {
        credentials: "include", // VERY IMPORTANT
      });

      console.log("Status:", response.status);

      if (!response.ok) {
        const text = await response.text();
        console.log("Error body:", text);
        setCurrentUser(null);

      } else {
        const user = await response.json();
        console.log("User from backend:", user);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setCurrentUser(null);
    } 
  };

  const getPosts = async () => {
    try {
      const response = await axios.get(`${baseurl}/posts`);
      const sortedPosts = response.data.sort(
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
      {currentUser &&
      <h2>User {currentUser.username} is logged in</h2>
}
      <h2>Feed</h2>
      <Posts posts={posts} refreshPosts={getPosts} />
    </div>
  );
};

export default Home;
