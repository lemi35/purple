import "./posts.scss";
import Post from "../post/Post";
import PostType from "../../types/PostType";
import { UsersProvider } from "../../contexts/UsersContext";

interface PostWithUser extends PostType {
  user: {
    username: string;
    profileImage?: string;
  }
}

interface PostsProps {
  posts: PostWithUser[];
  refreshPosts: () => void;
}

const Posts: React.FC<PostsProps> = ( {posts, refreshPosts} ) => {

    const baseurl = import.meta.env.VITE_API_URL;
    //const baseurl = "http://localhost:3001" 

    const getImageUrl = (image: string | undefined) => {
      if (!image) {
        return '';
      }
      const isExternalUrl = image.startsWith('http://') || image.startsWith('https://');
      return isExternalUrl ? image : `${baseurl}/${image}`;
    };
  

  const mapPosts = () => {
    return posts!.map(post => (
    
      <Post
        key={post.post_id}
        post={post}
        username={post.user.username || ''}
        profileImage={getImageUrl(post.user.profileImage)}
        upvotes={post.upvotes}
        downvotes={post.downvotes}
        post_id={post.post_id}
        refreshPosts={refreshPosts}
      />
    ));
  };

  return (
    <UsersProvider>
      <div className="posts">
      {posts && posts.length > 0 ? mapPosts() : <p>No posts available</p>}
      </div>
    </UsersProvider>
  );
};

export default Posts;
