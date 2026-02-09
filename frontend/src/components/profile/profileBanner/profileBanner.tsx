import { useContext, useRef } from "react";
import axios from "axios";
import Icon from "@mdi/react";
import { mdiCamera } from "@mdi/js";
import userContext from "../../../contexts/UserContext";
import UserType from "../../../types/UserType";
import "./profileBanner.scss";

interface ProfileBannerProps {
  user: UserType;
}

const ProfileBanner: React.FC<ProfileBannerProps> = ({ user }) => {
  const context = useContext(userContext);
  const { contextUsername } = context || {};
  const isOwner = contextUsername === user.username;

  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      await axios.put(`http://localhost:3001/users/update`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Ideally we should have a way to refresh the user data here.
      // For now, a window reload is the simplest way to see changes across the app.
      window.location.reload();
    } catch (error) {
      console.error(`Error uploading ${fieldName}:`, error);
    }
  };

  if (!user) {
    console.error("ProfileBanner received undefined user");
    return null;
  }
  return (
    <div className="banner">
      <div className="banner-image-container">
        {user.profileBanner && (
          <img
            src={
              user.profileBanner.startsWith("http")
                ? user.profileBanner
                : `http://localhost:3001/${user.profileBanner}`
            }
            alt="Banner"
            className="banner-image"
          />
        )}
        {isOwner && (
          <>
            <input
              type="file"
              ref={bannerInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleFileUpload(e, "profileBanner")}
            />
            <button
              className="edit-icon-button banner-edit"
              onClick={() => bannerInputRef.current?.click()}
            >
              <Icon path={mdiCamera} size={1} />
            </button>
          </>
        )}
      </div>
      <div className="profile-info-container">
        <div className="profile-header-content">
          <div className="profile-image-wrapper">
            {user.profileImage &&
            user.profileImage !== "url to profile image" ? (
              <img
                src={
                  user.profileImage.startsWith("http")
                    ? user.profileImage
                    : `http://localhost:3001/${user.profileImage}`
                }
                alt="Profile"
                className="profile-image"
              />
            ) : (
              <div className="profile-image-placeholder">
                <Icon path={mdiCamera} size={1.5} color="#ccc" />
              </div>
            )}

            {isOwner && (
              <>
                <input
                  type="file"
                  ref={profileInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload(e, "profileImage")}
                />
                <button
                  className="edit-icon-button profile-edit"
                  onClick={() => profileInputRef.current?.click()}
                >
                  <Icon path={mdiCamera} size={0.8} />
                </button>
              </>
            )}
          </div>
          <div className="username">{user.username}</div>
          <div className="profiletext">{user.profileText}</div>
        </div>
        "
      </div>
    </div>
  );
};

export default ProfileBanner;
