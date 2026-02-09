import { useContext } from 'react'
import "./topicComponent.scss"
import { Link } from 'react-router-dom'
import userContext from "../../contexts/UserContext";
//import axios from 'axios'

interface topicInterface {
  id: number,
  created_at: string,
  description: string,
  image: string | null,
  title: string,
  user_id?: number,
  username: string
}

interface TopicComponentProps extends topicInterface {
  refreshTopics?: () => void;
}

const topicComponent = ({ description, image, title, username,  refreshTopics }: TopicComponentProps) => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error('topicComponent must be used within a userContext.Provider');
  }
  const { contextUsername, contextRole } = context;

  const deleteTopic = async () => {
    try {
      //const deletedTopic = await axios.delete(`http://localhost:3001/topics/${id}`)
      refreshTopics?.();
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="div-topic-component" >
      <img
        src={
          image
            ? image.startsWith("http") // external URL
              ? image
              : `http://localhost:3001/${image}` // local backend
            : "https://placehold.co/200x200"
        }
        alt={title}
      />
      <div className='div-topic-title-desc'>
        <div style={{ width: "100%" }}>
          <Link to={`/community/${title}`} state={{ description }}>
            <h1>{title}</h1>
            {description}
          </Link>
        </div>
        <div style={{ display: "flex", width: "100%", marginTop: "20px", justifyContent: "space-between" }}>
          <span style={{ alignSelf: "flex-end" }}>created by: {username}</span>
          {(contextRole == "admin" || username == contextUsername) && <button onClick={() => deleteTopic()} style={{ alignSelf: "flex-end" }}>Delete topic</button>}
        </div>
      </div>
    </div>

  )
}

export default topicComponent