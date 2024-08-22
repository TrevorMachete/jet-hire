// src/components/BlogList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = await db.collection('posts').get();
      setPosts(postsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    await db.collection('posts').doc(id).delete();
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <div>
      <h2>Blog Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title}
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
