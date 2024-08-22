import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'posts', id));
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <div>
      <h2>Blog Posts</h2>
      <ul className="blog-list">
        {posts.map((post) => (
          <li key={post.id} className="blog-item">
            {post.media && <img src={post.media} alt={post.title} style={{ width: '200px', height: '200px' }} />}
            <h3>{post.title}</h3>
            <p>{new Date(post.createdAt.seconds * 1000).toLocaleDateString()}</p>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
