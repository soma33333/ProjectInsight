import React, { useState, useRef, useEffect } from "react";
import "./css/Post.css";
import { Link } from "react-router-dom";

const Post = ({ _id, title, summary, image, createdAt, updatedAt, Contributer }) => {
  const [showFull, setShowFull] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const summaryRef = useRef(null);

  const formattedCreatedAt = new Date(createdAt).toLocaleDateString();
  const formattedUpdatedAt = new Date(updatedAt).toLocaleDateString();

  const toggleReadMore = () => setShowFull(!showFull);

  const handlelike = () => {
    console.log("liked")
  }

  // Check if summary overflows container
  useEffect(() => {
    if (summaryRef.current) {
      setIsOverflowing(summaryRef.current.scrollHeight > summaryRef.current.clientHeight);
    }
  }, [summary, showFull, window.innerWidth]);

  return (
    <div className="post-card">
      <Link to={`post/${_id}`} className="image-link">
        <div className="post-image">
          <img src={image} alt={title} />
        </div>
      </Link>

      <div className="post-info">
        <Link to={`post/${_id}`} className="title-link">
          <h2 className="post-title">{title}</h2>
        </Link>

        <p
          className={`post-summary ${showFull ? "expanded" : "collapsed"}`}
          ref={summaryRef}
        >
          {summary}
        </p>

        {isOverflowing && (
          <span className="read-more" onClick={toggleReadMore}>
            {showFull ? " Show less" : " Read more"}
          </span>
        )}

        <p className="post-meta"><strong>Contributer:</strong> {Contributer.name}</p>
        <p className="post-meta"><strong>Created At:</strong> {formattedCreatedAt}</p>
        <p className="post-meta"><strong>Last Modified:</strong> {formattedUpdatedAt}</p>
        <div className="like-button" onClick={handlelike}>
          <i className="fa-regular fa-thumbs-up"></i>
      
          </div>
              <p className="likes-count">23344 likes</p>
      </div>
    </div>
  );
};

export default Post;
