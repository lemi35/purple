import { useEffect, useState } from "react";
import "./profileUpdate.scss";

interface UserProfile {
  id: number;
  username: string;
  profileText?: string;
  profileImage?: string;
  profileBanner?: string;
}

interface ProfileUpdateProps {
  currentUser: UserProfile;
}

const ProfileUpdate: React.FC<ProfileUpdateProps> = ({ currentUser }) => {
  const [profileText, setProfileText] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileBannerFile, setProfileBannerFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const baseurl = "http://localhost:3001";

  useEffect(() => {
    setProfileText(currentUser.profileText || "");
  }, [currentUser]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("profileText", profileText);
    if (profileImageFile) formData.append("profileImage", profileImageFile);
    if (profileBannerFile) formData.append("profileBanner", profileBannerFile);

    try {
      await fetch(`${baseurl}/users/${currentUser.id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile-update">
      <h2>Update Your Profile</h2>

      {successMessage && <div className="div-success">{successMessage}</div>}

      <form className="form-profile-update" onSubmit={handleUpdate}>
        <label>
          Profile Text
          <input
            type="text"
            value={profileText}
            onChange={e => setProfileText(e.target.value)}
          />
        </label>

        <label>
          Profile Image
          <input
            type="file"
            onChange={e => e.target.files && setProfileImageFile(e.target.files[0])}
          />
        </label>

        <label>
          Banner Image
          <input
            type="file"
            onChange={e => e.target.files && setProfileBannerFile(e.target.files[0])}
          />
        </label>

        <button type="submit">Update Profile</button>
      </form>

      {/*<div className="profile-preview">
        <h3>Preview</h3>
        {currentUser.profileBanner && (
          <img src={currentUser.profileBanner} alt="Banner" />
        )}
        {currentUser.profileImage && (
          <img src={currentUser.profileImage} alt="Profile" />
        )}
        <p>{profileText}</p>
      </div>*/}
    </div>
  );
};


export default ProfileUpdate;
