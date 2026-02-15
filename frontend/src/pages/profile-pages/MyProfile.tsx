import "./profilePage.scss";
import { useState, useEffect } from "react";
//import axios from "axios";
import ChangePassword from "../../components/changePassword/ChangePassword";
import CreateTopic from "../../components/topicCreate/topicCreate";
import DeleteAccount from "../../components/deleteAccount/DeleteAccount";
import ProfileContent from "../../components/profile/ProfileContent";
import UserType from "../../types/UserType";
import PostCreate from "../../components/postCreate/PostCreate";
import PostType from "../../types/PostType";
import Posts from "../../components/posts/Posts";
import ProfileUpdate from "../../components/profile/profileUpdate/ProfileUpdate";

/*interface ProfileProps {
  currentUser: UserType | null;
}*/

interface PostWithUser extends PostType {
  user: {
    username: string;
    profileImage?: string;
  };
}

const Profile: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);

  const baseurl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchCurrentUser();
    fetchCurrentUser2();
    getPosts();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${baseurl}/users/me`, {
        credentials: "include",
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
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchCurrentUser2 = async () => {
    try {
      const response = await fetch(`${baseurl}/me`, {
        credentials: "include",
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
    } finally {
      setLoadingUser(false);
    }
  };

  const getPosts = async () => {
    try {
      const response = await fetch(`${baseurl}/posts`);
      const data = await response.json();

      const sortedPosts = data.sort(
        (a: PostWithUser, b: PostWithUser) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );

      setPosts(sortedPosts);
    } catch (error) {
      console.error("error fetching posts:", error);
    }
  };

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <div>No user logged in</div>;
  }



  return (
    <div className="profilePage">
      <h2>User {currentUser.username} is logged in</h2>
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
       
          <div className="action-card">
            <ChangePassword />
          </div>
        
     
          <div className="action-card">
            <DeleteAccount />
          </div>
        
      </ProfileContent>
    </div>
  );
};

export default Profile;
