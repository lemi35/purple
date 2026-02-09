import "./topicCreate.scss";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface NewTopic {
  title: string;
  description: string;
  image: File | null;
}

const topicCreate = () => {
  const baseurl = "http://localhost:3001";

  const [post, setPost] = useState<NewTopic>({
    title: "",
    description: "",
    image: null,
  });

  // Handle text fields
  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, title: e.target.value });
  };

  const handleDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPost({ ...post, description: e.target.value });
  };

  // Handle file input
  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPost({ ...post, image: e.target.files[0] });
    }
  };

  const handleReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setPost({ title: "", description: "", image: null });
    if (e.currentTarget.form) {
      e.currentTarget.form.reset(); // resets file input as well
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("description", post.description);
      if (post.image) formData.append("image", post.image);

      await axios.post(`${baseurl}/topics`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Topic created successfully:", post);
      setPost({ title: "", description: "", image: null });
    } catch (error) {
      console.error("Error submitting topic:", error);
    }
  };

  return (
    <form className="create-topic-container" onSubmit={handleSubmit}>
      <h3>Create Your Topic</h3>

      <label htmlFor="title">Title</label>
      <input
        value={post.title}
        onChange={handleTitle}
        name="title"
        id="title"
        type="text"
        placeholder="Enter topic name"
        required
      />

      <label htmlFor="description">Description</label>
      <textarea
        value={post.description}
        onChange={handleDescription}
        name="description"
        id="description"
        placeholder="Description for your topic"
        rows={4}
      />

      <label htmlFor="image">Banner Image</label>
      <input
        type="file"
        onChange={handleImage}
        name="image"
        id="image"
        accept="image/png, image/jpeg"
      />

      <div className="button-group">
        <button type="submit">Create</button>
        <button type="reset" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default topicCreate;
