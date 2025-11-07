import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "./css/Postpage.css"
import { useAuth } from "../context/AuthContext"

const Postpage = () => {
  const { id } = useParams()
  const [post, setPosts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [Contributer, setContributer] = useState(null)
  const navigate = useNavigate()
  const { isLoggedIn, setIsLoggedIn } = useAuth()
  const { user, setUser } = useAuth()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [commentload, setcommentload] = useState(true)

  const handleAddComment = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/comment`,
        {
          userId: user.id,
          postId: id,
          content: newComment,
        },
        { withCredentials: true },
      )
      setcommentload((prev) => !prev)
    } catch (error) {
      setError(error.response?.data?.message || "Adding comment failed.")
    } finally {
      setNewComment("")
    }
  }

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm("Are you sure you want to delete this comment?")

    if (confirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/delete_comment/${commentId}`, {
          withCredentials: true,
        })
        setcommentload((prev) => !prev)
      } catch (error) {
        console.error("Error deleting comment:", error)
        setError("Failed to delete the comment.")
      }
    }
  }

  const handledelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this post?")

    if (confirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/delete_post/${id}`, {
          withCredentials: true,
        })
        alert("Post deleted ...")
        navigate("/")
      } catch (error) {
        console.error("Error deleting post:", error)
        setError("Failed to delete the post.")
      }
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/getpostbyid/${id}`, {
          withCredentials: true,
        })
        setPosts(response.data.post)
        setContributer(response.data.Contributer)
      } catch (error) {
        console.error("Error fetching posts:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [id])

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/getcomment/${id}`, {
          withCredentials: true,
        })
        setComments(response.data.comments)
      } catch (error) {
        console.error("Error fetching comments:", error)
        setError(error.message)
      }
    }
    fetchComments()
  }, [commentload]) // Removed unnecessary commentload dependency

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div>
        <h2 style={{ top: "500px" }}>Please Login to view this post</h2>
      </div>
    )
  }

  return (
    <div className="post-container">
      {Contributer.id === post.Contributer._id ? (
        <div className="edit-dlt">
          <Link className="button-link" to={`/edit/${post._id}`}>
            <h2>Edit post</h2>
          </Link>
          <button className="button-link" onClick={handledelete}>
            <h2>Delete post</h2>
          </button>
        </div>
      ) : (
        <Link className="button-link" to={`/contact/${post._id}`}>
          <h2>Contact</h2>
        </Link>
      )}

      {post ? (
        <>
          <div className="image">
            <img src={post.image} alt={post.title} />
          </div>
          <h1>{post.title}</h1>
          <p className="author">
            <strong>Contributer:</strong> {post.Contributer.name}
          </p>
          <p className="created-at">Created At: {new Date(post.updatedAt).toLocaleDateString()}</p>
          <p>{post.summary}</p>
          <hr></hr>
          <div className="comments-section">
            <h2>Comments</h2>
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    <pre>
                      <span><strong>{comment.userId.name}:  </strong></span>
                      <span>{comment.content}               </span>
                      {/* <span>{new Date(comment.createdAt).toLocaleString()}  </span> */}
                      {user.id === comment.userId._id && (
                        <button onClick={() => handleDeleteComment(comment._id)} className="delete-comment">
                          Delete
                        </button>
                      )}
                    </pre>

                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </div>
          <div className="add-comment">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
            ></textarea>
            <button onClick={handleAddComment}>Add Comment</button>
          </div>
        </>
      ) : (
        <div>No post found.</div>
      )}
    </div>
  )
}

export default Postpage

