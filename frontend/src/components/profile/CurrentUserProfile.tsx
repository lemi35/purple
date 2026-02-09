import "./userProfile.scss";
import UserType from "../../types/UserType";
import ProfileContent from "./ProfileContent";

interface CurrentUserProfileProps {
    currentUser: UserType | null;
}

const CurrentUserProfile: React.FC<CurrentUserProfileProps> = ({ currentUser }) => {


    if (!currentUser) return null;

    return (
        <div className="profile">
            <ProfileContent user={currentUser} />
        </div>
    );
};

export default CurrentUserProfile;