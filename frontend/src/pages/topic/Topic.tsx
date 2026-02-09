import { useEffect, useState, useContext } from "react";
import axios from "axios";
import TopicComponent from "../../components/topicComponent/topicComponent";
import userContext from "../../contexts/UserContext";
import TopicType from "../../types/TopicType";
import TopicCreate from "../../components/topicCreate/topicCreate";
import "./topic.scss";




const Topic: React.FC = () => {
  const { contextRole } = useContext(userContext) || {};
  const baseurl = "http://localhost:3001";

  const [topics, setTopics] = useState<TopicType[] | null>(null);
  const [newTopic, setNewTopic] = useState({ title: "", description: "" });
  const [file, setFile] = useState<File | null>(null);

  const fetchTopics = async () => {
    const response = await axios.get<TopicType[]>(`${baseurl}/topics`);
    setTopics(response.data);
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newTopic.title);
    formData.append("description", newTopic.description);
    if (file) formData.append("image", file);

    try {
      await axios.post(`${baseurl}/topics`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewTopic({ title: "", description: "" });
      setFile(null);
      fetchTopics();
    } catch (error) {
      console.error("Error creating topic:", error);
    }
  };

  const mapTopics = () => {
    if (!topics) return null;

    const getImageUrl = (image: string | null) => {
      if (!image) return "";
      return image.startsWith("http") ? image : `${baseurl}/${image}`;
    };

    return topics.map((topic) => (
      <TopicComponent
        key={topic.topic_id}
        id={topic.topic_id}
        title={topic.title}
        created_at={topic.created_at}
        description={topic.description ?? ""}
        image={getImageUrl(topic.image)}
        user_id={topic.owner?.id ?? 0}
        username={topic.owner?.username ?? "System"}
      />
    ));
  };

  return (
    <div className="div-topic-container">
      <TopicCreate />
      {contextRole === "admin" && (
        <form onSubmit={handleSubmit} className="topic-create-form">
          <h3>Create New Topic</h3>
          <input
            type="text"
            placeholder="Title"
            value={newTopic.title}
            onChange={(e) =>
              setNewTopic({ ...newTopic, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description"
            value={newTopic.description}
            onChange={(e) =>
              setNewTopic({ ...newTopic, description: e.target.value })
            }
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button type="submit">Create Topic</button>
        </form>
      )}
      {topics && <div className="topic-list">{mapTopics()}</div>}
    </div>
  );
};

export default Topic;
