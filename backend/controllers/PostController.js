const Post = require("../models/Post");
const cloudinary = require('../config/cloudinaryConfig'); // import the Cloudinary configuration


const createPost = async (req, res) => {
  try {
    const { title, summary } = req.body;
    const Contributer = req.user.id;

    // Check if the image is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Cloudinary stores the image URL in req.file.path
    const imageUrl = req.file.path; // This is the Cloudinary URL

    const postdoc = await Post.create({
      title,
      summary,
      image: imageUrl, // Save the Cloudinary URL to your post
      Contributer,
    });

    res.status(201).json({ message: 'Post created successfully', post: postdoc });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: 'Error creating post', error });
  }
};







const update_post = async (req, res) => {
  const { title, summary } = req.body;
  const postId = req.params.id;
  const user = req.user.id;
  const updateFields = {};

  // Update title and summary if provided
  if (title) updateFields.title = title;
  if (summary) updateFields.summary = summary;

  // Update image if a new file is uploaded
  if (req.file) {
    updateFields.image = req.file.path; // Cloudinary URL will be in req.file.path
  }

  updateFields.updatedAt = Date.now();

  try {
    // Check if there is any data to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No data to update" });
    }

    // Update the post with the new data
    const post = await Post.findByIdAndUpdate(
      postId,
      { ...updateFields, user },
      { new: true }
    );

    // If the post is not found
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




const getpost_byid= async (req, res) => {
    const { id } = req.params;
    try {
      const post = await Post.findById(id).populate("Contributer", "name");
      res.status(200).json({ post, Contributer: req.user });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};



const delete_postbyid=async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



const  get_post= async (req, res) => {
    try {
        const posts = await Post.find().populate("Contributer", "name");
        
        res.status(200).json(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error" });
      }
  };


const search_post = async (req, res) => {
  const { query } = req.query; // get search query

  try {
    // Populate Contributer to access their name
    const posts = await Post.find().populate("Contributer");

    // Filter posts by title or author name
    const filteredPosts = posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(query?.toLowerCase() || "");
      const authorMatch = post.Contributer?.name
        ?.toLowerCase()
        .includes(query?.toLowerCase() || "");
      return titleMatch || authorMatch;
    });

    res.json({
      message: "Posts found successfully",
      count: filteredPosts.length,
      posts: filteredPosts,
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({
      message: "Error while searching",
      error: error.message,
    });
  }
};
    
  
const get_receiver=async(req,res)=>{
  const { id } = req.params;
    try {
      const post = await Post.findById(id).populate("Contributer", "name email");
      res.status(200).json({ post });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
}

module.exports={createPost,get_post,getpost_byid,update_post,delete_postbyid,search_post,get_receiver}