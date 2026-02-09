
import { useEffect, useState } from "react";
import "./profileContent.scss";
import "../post/post.scss"
import SortedPosts from "../sortedPosts/SortedPosts";
import ProfileBanner from "./profileBanner/profileBanner";
import UserType from "../../types/UserType";
import PostType from "../../types/PostType";
import axios from "axios";

interface ProfileContentProps {
  user: UserType;
}

interface PostWithUser extends PostType {
  user: {
    username: string;
    profileImage?: string;
  }
}

const ProfileContent: React.FC<ProfileContentProps & { children?: React.ReactNode }> = ({ user, children }) => {
  const [myposts, setMyPosts] = useState<PostWithUser[]>([]);
  const baseurl = "http://localhost:3001";

  useEffect(() => {
    const getPosts = async () => {
      if (!user || !user.id) return;
      try {
        const response = await axios.get(`${baseurl}/posts`);
        const posts = response.data as PostWithUser[];
        const filteredPosts = posts.filter(post => post.user_id === user.id);
        setMyPosts(filteredPosts);
      } catch (error) {
        console.error("error fetching posts:", error);
      }
    };
    getPosts();
  }, [user]);

  return (
    <div className="profileContent">
      <ProfileBanner user={user} />
      <div className="profile-layout-grid">
        <div className="main-content">
          <div className="post">
            {myposts.length > 0
              ? <SortedPosts posts={myposts}/>
              : <p className="noPosts">This user hasn't posted anything yet</p>}
          </div>
        </div>
        {children && (
          <div className="sidebar-actions">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileContent;
