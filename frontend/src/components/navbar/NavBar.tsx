import "./navBar.scss";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiCircle } from "@mdi/js";

import { mdiForumOutline } from "@mdi/js";
import UserType from "../../types/UserType";
import DropdownMenu from "../dropdownMenu/DropdownMenu";
import UserProfile from "../../pages/profile-pages/UserProfile";
import UserSearch from "../userSearch/UserSearch";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import userContext from "../../contexts/UserContext";

interface NavBarProps {
  currentUser: UserType | null;
  onUserSelect: (user: UserType) => void;
  selectedUser: UserType | null;
}

const NavBar: React.FC<NavBarProps> = ({ currentUser }) => {
  //const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  //const navigate = useNavigate();
  const context = useContext(userContext);
  if (!context) {
    throw new Error("NavBar must be used within a userContext.Provider");
  }
  const { contextUsername, setContextUsername, /*contextRole, setContextRole*/ } =
    context;
  //const baseurl = "http://localhost:3001";
  const baseurl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseurl}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
  }, [currentUser, contextUsername]);

  const blobUrlsRef = useRef<string[]>([]);

  const getProfileImageUrl = (image?: string | Blob | File | null) => {
    if (!image) return "/def-av.jpg";
    if (typeof image === "string") {
      const isExternal =
        image.startsWith("http://") || image.startsWith("https://");
      return isExternal ? image : `${baseurl}/${image.replace(/^\//, "")}`;
    }
    const url = URL.createObjectURL(image);
    blobUrlsRef.current.push(url);
    return url;
  };

  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      blobUrlsRef.current = [];
    };
  }, []);

  /*const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );*/

  const handleLogout = () => {
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setContextUsername(undefined);
    //setContextRole(undefined);
    //setCurrentUser(null);
    window.location.href = "/login";
  };

  return (
    <div className="navBar">
      <div className="left">
        <DropdownMenu />
        <Icon path={mdiCircle} size={1} color="purple" />
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="spanTitle">Purple</span>
        </Link>
      </div>

      <div className="middle">
        <UserSearch users={users} onUserSelect={(user) => setSelectedUser(user)} />
      </div>

      <div className="right">
        <Link to="/chat">
          <Icon path={mdiForumOutline} size={1} color="white" />
        </Link>
        <div className="p-user">
          {currentUser ? (
            <>
              <img
                src={getProfileImageUrl(currentUser.profileImage)}
                alt=""
                height={30}
                width={30}
                onError={(e) => {
                  console.error(
                    "Profile image failed to load:",
                    e.currentTarget.src,
                  );
                  e.currentTarget.src = "/def-av.jpg";
                }}
              />
              <span>{contextUsername}</span>
              <button onClick={() => handleLogout()} className="button">
                Log out
              </button>
            </>
          ) : ""}
        </div>
      </div>
      {selectedUser ? (
        <div className="clickedUser">
          <UserProfile user={selectedUser} />
        </div>
      ) : null}
    </div>
  );
};

export default NavBar;
