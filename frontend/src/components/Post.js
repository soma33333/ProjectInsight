import React, { useState, useRef, useEffect } from "react";
import "./css/Post.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Post = ({ _id, title, summary, image, createdAt, updatedAt, Contributer }) => {
  const [showFull, setShowFull] = useState(false);
  const { user } = useAuth()
  const [isOverflowing, setIsOverflowing] = useState(false);
  const summaryRef = useRef(null);
  const [likecount, setlikecount] = useState(0)
  const [togglelike, settogglelike] = useState(false)
  const [color, setcolor] = useState(false)
  const formattedCreatedAt = new Date(createdAt).toLocaleDateString();
  const formattedUpdatedAt = new Date(updatedAt).toLocaleDateString();

  const toggleReadMore = () => setShowFull(!showFull);

  const handlelike = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/addlike`, {
        userid: user?.id,
        postid: _id
      });
      settogglelike(!togglelike);
      if (res.data.message === "Liked") {
        // console.log("hereeee")
        setcolor(true);
      } else if (res.data.message === "Unliked") {
        // console.log("not  here")
        setcolor(false);
      }


    } catch (err) {
      console.log(err);
    }
  };

useEffect(() => {
  if (!user || !_id) return;

  const checkUserLiked = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/checklike`, {
        userid: user.id,
        postid: _id
      });

      console.log("CheckLike Response:", res.data);

      if (res.data.message === 'yes' ) {
        console.log("hii")
        setcolor(true);
      } else {
        console.log("hloo")
        setcolor(false);
      }
    } catch (err) {
      console.log("checklike error:", err);
    }
  };

  checkUserLiked();
}, [user, _id]);


  useEffect(() => {

    const fetchcount = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/like_count/${_id}`);
        setlikecount(response.data.likes)
        // console.log(response.data.likes)
      }
      catch (err) {
        console.log(err)
      }
    }

    fetchcount()
  }, [togglelike])

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
        {/* {console.log("color:", color)} */}

        {user && (
          <>
            <div
              className="like-button"
              onClick={handlelike}
              style={{
                backgroundColor: color ? "green" : "transparent",
                color: color ? "white" : "black",
                borderRadius: "50%",
                padding: "10px",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              <i className={`fa${color ? 's' : '-regular'} fa-thumbs-up`}></i>
            </div>
            <p className="likes-count">{likecount} likes</p>
          </>
        )}

      </div>
    </div>
  );
};

export default Post;
