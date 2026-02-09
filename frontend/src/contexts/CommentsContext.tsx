import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import CommentType from "../types/CommentType";

interface CommentsContextType {
  comments: CommentType[];
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

export const CommentsProvider: React.FC<{ children: ReactNode; postId: number }> = ({ children, postId }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const baseurl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${baseurl}/comments/post/${postId}`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  return (
    <CommentsContext.Provider value={{ comments, setComments }}>
      {children}
    </CommentsContext.Provider>
  );
};

export default CommentsContext;

