import "./profilePage.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import ChangePassword from "../../components/changePassword/ChangePassword";
import CreateTopic from "../../components/topicCreate/topicCreate";
import DeleteAccount from "../../components/deleteAccount/DeleteAccount";
import ProfileContent from "../../components/profile/ProfileContent";
import UserType from "../../types/UserType";
import PostCreate from "../../components/postCreate/PostCreate";
import PostType from "../../types/PostType";
import Posts from "../../components/posts/Posts";
import ProfileUpdate from "../../components/profile/profileUpdate/ProfileUpdate";

interface ProfileProps {
  currentUser: UserType | null;
}

interface PostWithUser extends PostType {
  user: {
    username: string;
    profileImage?: string;
  };
}

const Profile: React.FC<ProfileProps> = ({ currentUser }) => {
    const [posts, setPosts] = useState<PostWithUser[]>([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);
    
    const baseurl = "http://localhost:3001";

  


  const userIsLoggedIn = document.cookie
    .split("; ")
    .find((row) => row.startsWith("refreshtoken"))
    ?.split("=")[1];

  if (!currentUser) {
    return <div>No user logged in</div>;
  }

  

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
    <div className="profilePage">
      <ProfileContent user={currentUser}>

        <button onClick={() => setShowPasswordModal(true)} className="action-btn" style={{ backgroundColor: "#5E3078" }}>
          Change Password
        </button>
        <button onClick={() => setShowProfileUpdateModal(true)} className="action-btn" style={{ backgroundColor: "#8A50AB" }}>
          Update profile
        </button>


       {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="action-button"
              onClick={() => setShowPasswordModal(false)}
            >
              ✖
            </button>
            <ChangePassword />
          </div>
        </div>
        )}

         {showProfileUpdateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="action-button"
              onClick={() => setShowProfileUpdateModal(false)}
            >
              ✖
            </button>
            <ProfileUpdate currentUser={currentUser}/>
          </div>
        </div>
        )}

        <div className="action-card">
          <PostCreate refreshPosts={getPosts} />
        </div>
              <Posts posts={posts} refreshPosts={getPosts} />

        <div className="action-card">
          <CreateTopic />
        </div>
        {userIsLoggedIn && (
          <div className="action-card">
            <ChangePassword />
          </div>
        )}
        {userIsLoggedIn && (
          <div className="action-card">
            <DeleteAccount />
          </div>
        )}
      </ProfileContent>
    </div>
  );
};

export default Profile;
