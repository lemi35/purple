import "./postCreate.scss";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import PostType from "../../types/PostType";
import axios from "axios";

interface TopicType {
  topic_id: number;
  title: string;
}

interface PostCreateProps {
  refreshPosts: () => void;
}

export default function PostCreate({ refreshPosts }: PostCreateProps) {
    const baseurl = import.meta.env.VITE_API_URL;
    const [topics, setTopics] = useState<TopicType[]>([]);
    const [post, setPost] = useState<PostType>({
    post_id: 0,
    user_id: 1,
    title: "",
    content: "",
    image: null,
    created_at: "",
    upvotes: 0,
    downvotes: 0,
    topic: "General Discussion",
    topic_id: 0,
  });

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await axios.get(`${baseurl}/topics`);
        setTopics(response.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    }

    fetchTopics();
  }, []);

  useEffect(() => {
    const generalDiscussionExists = topics.some(
      (topic) => topic.title === "General Discussion",
    );
    if (!generalDiscussionExists && topics.length > 0) {
      createGeneralDiscussionTopic();
    }

    if (post.topic_id === 0) {
      const defaultTopic = topics.find((t) => t.title === post.topic);
      if (defaultTopic) {
        setPost((prev) => ({ ...prev, topic_id: defaultTopic.topic_id }));
      }
    }
  }, [topics]);

  const createGeneralDiscussionTopic = async () => {
    try {
      const response = await axios.post(
      `${baseurl}/topics`,
      { title: "General Discussion" },
      { withCredentials: true },
    );
      setTopics([...topics, response.data]);
    } catch (error) {
      console.error("Error creating General Discussion topic:", error);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "topic") {
      const selectedTopic = topics.find((topic) => topic.title === value);
      if (selectedTopic) {
        setPost({ ...post, topic: value, topic_id: selectedTopic.topic_id });
      }
    } else {
      setPost({ ...post, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (post.topic_id === 0) {
      const topic = topics.find((t) => t.title === post.topic);
      if (topic) {
        post.topic_id = topic.topic_id;
      } else {
        alert("Please select a topic before submitting.");
        return;
      }
    }

    const formData = new FormData();
    formData.append("title", post.title || "");
    formData.append("content", post.content || "");
    formData.append("user_id", post.user_id.toString());
    formData.append("topic_id", post.topic_id.toString());
    if (post.image) {
      formData.append("image", post.image);
    }

    try {
      const response = await axios.post(
        baseurl,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("Post created successfully:", response.data);
      setPost({
        ...post,
        title: "",
        content: "",
        image: null,
      });
      refreshPosts();
      alert("Post created successfully!");
    } catch (error: any) {
      console.error("=== ERROR CREATING POST ===");
      console.error("Full error object:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);

      let errorMessage = "Failed to create post";
      if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please try logging in again.";
      } else if (error.response?.data) {
        errorMessage = `Failed: ${error.response.data}`;
      } else if (error.message) {
        errorMessage = `Failed: ${error.message}`;
      }

      alert(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-container">
        <h2>Create a Post</h2>

        <label htmlFor="title" className="label-title">
          Title
        </label>
        <input
          className="input-title"
          value={post.title}
          onChange={handleChange}
          name="title"
          id="title"
          type="text"
          placeholder="Enter post title"
        />

        <label htmlFor="content" className="label-content">
          Content
        </label>
        <textarea
          className="input-content"
          value={post.content}
          onChange={handleChange}
          name="content"
          id="content"
          placeholder="Share your thoughts"
          rows={4}
        />

        <label htmlFor="topic" className="label-topic">
          Topic
        </label>
        <select
          className="input-topic"
          value={post.topic}
          onChange={handleChange}
          name="topic"
          id="topic"
        >
          <option value="" disabled>
            Select a Topic
          </option>
          {topics.map((topic) => (
            <option key={topic.topic_id} value={topic.title}>
              {topic.title}
            </option>
          ))}
        </select>

        <input
          className="input-file"
          type="file"
          onChange={(e) =>
            setPost({
              ...post,
              image: e.target.files ? e.target.files[0] : null,
            })
          }
          name="image"
          id="image"
          accept="image/png, image/jpeg"
        />

        <div className="button-group">
          <button type="submit" className="btn-submit">
            Submit
          </button>
          <button
            type="reset"
            className="btn-reset"
            onClick={() =>
              setPost({ ...post, title: "", content: "", image: null })
            }
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}
