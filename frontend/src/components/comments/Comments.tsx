import "./comments.scss";
import moment from "moment";
import CommentsContext from "../../contexts/CommentsContext";
import UserType from "../../types/UserType";
import { useContext } from 'react';
import CommentType from "../../types/CommentType";

interface CommentsProps {
  postId: number;
  users: UserType[];
  comments: CommentType[];
}

const Comments: React.FC<CommentsProps> = ({ postId, users, comments }) => {
  const commentsContext = useContext(CommentsContext);

  if (!commentsContext) {
    return <div>Loading...</div>;
  }

  // Filter comments based on the postId
  const postComments = comments.filter(comment => comment.post_id === postId);

  return (
    <div className="comments">
      {postComments.map(comment => { // Find the user associated with the comment
        const user = users.find(user => user.id === comment.user_id);
        if (!user) return null; // Handle if user is not found

        return (
          <div className="comment" key={comment.comment_id}>
            <img src={user.profileImage} alt="" />
            <span>{user.username}</span>
            <div className="info">
              <span>{comment.content}</span>
            </div>
            <span className="date">{moment(comment.created_at).fromNow()}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
