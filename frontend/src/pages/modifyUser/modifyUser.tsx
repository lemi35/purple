import ProfileUpdate from "../../components/profile/profileUpdate/ProfileUpdate"
import  UserType  from "../../types/UserType";

interface ModifyUserProps {
  currentUser: UserType;
}

const modifyUser: React.FC<ModifyUserProps> = ({ currentUser }) => {
  return (
    <div>
      <ProfileUpdate currentUser={currentUser} />
    </div>
  );
};

export default modifyUser;