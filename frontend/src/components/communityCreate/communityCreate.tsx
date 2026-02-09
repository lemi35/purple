import "./communityCreate.scss";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface NewCommunity {
  name: string;
  description: string;
  image: File | null;
}

const CommunityCreate = () => {
  const baseurl = import.meta.env.VITE_API_URL;
  //const baseurl = "http://localhost:3001";
  const [success, setSuccess] = useState(false);

  const [community, setCommunity] = useState<NewCommunity>({
    name: "",
    description: "",
    image: null,
  });

  // Handle text fields
  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setCommunity({ ...community, name: e.target.value });
  };

  const handleDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommunity({ ...community, description: e.target.value });
  };

  // Handle file input
  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCommunity({ ...community, image: e.target.files[0] });
    }
  };

  const handleReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setCommunity({ name: "", description: "", image: null });
    if (e.currentTarget.form) {
      e.currentTarget.form.reset(); // resets file input as well
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", community.name);
      formData.append("description", community.description);
      if (community.image) formData.append("image", community.image);

      const response = await axios.post(`${baseurl}/communities`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Axios response:", response);

      if (response.status === 200) {
        setSuccess(true);
        console.log("Community created successfully:", community);
        setCommunity({ name: "", description: "", image: null });
        setTimeout(() => setSuccess(false), 3000);
      }

    } catch (error) {
      console.error("Error submitting community:", error);
    }
  };

  return (
    <div className="create-community-wrapper">
      {/* Success popup */}
      {success && (
        <div className="success-popup">Community successfully created 🎉</div>
      )}

      {/* Form */}
      <form className="create-community-container" onSubmit={handleSubmit}>
        <h3>Create Your Community</h3>

        <label htmlFor="title">Title</label>
        <input
          value={community.name}
          onChange={handleTitle}
          name="title"
          id="title"
          type="text"
          placeholder="Enter community name"
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          value={community.description}
          onChange={handleDescription}
          name="description"
          id="description"
          placeholder="Description for your community"
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
    </div>
  );
};

export default CommunityCreate;
