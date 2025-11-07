import React, { useState } from "react";
import axios from "axios";
import "./css/newpost.css";
import { useNavigate } from "react-router-dom";

const Createnewpost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/createpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      setMessage("Form submitted successfully!");
      console.log("Response:", response.data);
      setTitle("");
      setSummary("");
      setImage(null);
      alert("New Post Created  ...");
      navigate("/");
    } catch (error) {
      setMessage("Form submission failed.");
      console.error("Error:", error);
    }
  };

  return (
    <div  className="container">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Summary:</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      <>{message}</>
    </div>
  );
};

export default Createnewpost;
