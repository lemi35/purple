import { useContext } from "react";
import "./communityComponent.scss";
import { Link } from "react-router-dom";
import userContext from "../../contexts/UserContext";
//import axios from "axios";

interface CommunityProps {
  community_id: number;
  name: string;
  description: string;
  image: string | null;
  username: string;
}

const CommunityComponent = ({
  community_id,
  name,
  description,
  image,
}: CommunityProps) => {

  const baseurl = import.meta.env.VITE_API_URL;


  const context = useContext(userContext);
  if (!context) {
    throw new Error(
      "CommunityComponent must be used within a userContext.Provider",
    );
  }
  //const { contextUsername, contextRole } = context;

  /*const deleteCommunity = async () => {
    try {
      const deletedCommunity = await axios.delete(
        `http://localhost:3001/communities/${community_id}`,
      );
    } catch (error) {
      console.log(error);
    }
  };
  */

  return (
    <div className="div-community-component">
  <div className="community-img-wrapper">
    <img
      src={
        image
          ? image.startsWith("http")
            ? image
            : `${baseurl}/${image}`
          : "https://placehold.co/300x200"
      }
      alt={name}
    />
  </div>

  <div className="div-community-title-desc">
    <Link to={`/community/${community_id}`}>
      <h1>{name}</h1>
      <p>{description}</p>
    </Link>
  </div>
</div>
  );
};

export default CommunityComponent;
