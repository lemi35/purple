import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import PostType from "../types/PostType";

interface UsersPostsContextType {
  posts: PostType[];
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
}

const UsersPostsContext = createContext<UsersPostsContextType | undefined>(undefined);

interface UsersPostsProviderProps {
  children: ReactNode;
  userId: number; 
}

export const UsersPostsProvider: React.FC<UsersPostsProviderProps> = ({ children, userId }) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const baseurl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${baseurl}/posts/user/${userId}`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [userId]);

  return (
    <UsersPostsContext.Provider value={{ posts, setPosts }}>
      {children}
    </UsersPostsContext.Provider>
  );
};

export default UsersPostsContext;
