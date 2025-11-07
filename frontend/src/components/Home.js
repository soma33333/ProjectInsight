import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";
import "./css/Search.css"
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/getpost`
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]); // Clear search if input is empty
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/search_post`,
          { params: { query: searchQuery } }
        );
        
        if (response.data.posts.length > 0) {
          setSearchResults(response.data.posts); // Show search results
        } else {
          setSearchResults([]); // No results, show all posts
        }
      } catch (error) {
        console.error("Search failed", error);
        setSearchResults([]); // Reset if search fails
      }
    };

    handleSearch();
  }, [searchQuery]);

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search posts by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="Home">
        {(searchResults.length > 0 ? searchResults : posts).map((post) => (
          <Post key={post._id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
