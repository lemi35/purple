import "./userProfile.scss";
import UserType from "../../types/UserType";
import ProfileContent from "./ProfileContent";

interface ProfileContentProps {
    user: UserType | null;
  }

const ProfileComponent: React.FC<ProfileContentProps> = ({user}) => {

    if (!user) return null;

    return (
        <div className="profile">
            <ProfileContent user={user}/>
        </div>
    );
};

export default ProfileComponent;