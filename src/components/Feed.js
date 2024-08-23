import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import '../App.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const allPosts = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.posts) {
          allPosts.push(...data.posts);
        }
      });
      // Sort posts by createdAt in descending order
      allPosts.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
      setPosts(allPosts);
    };

    fetchPosts();
  }, []);

  const renderContent = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const image = doc.querySelector('img');
    const title = doc.querySelector('h2');
    const paragraphs = doc.querySelectorAll('p');

    return (
      <div className="post-content">
        {image && <img src={image.src} alt="Post media" className="responsive-image" />}
        {title && <h2>{title.textContent}</h2>}
        {Array.from(paragraphs).map((p, index) => (
          <p key={index}>{p.textContent}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="feed">
      {posts.map((post) => (
        <div key={post.postNumber} className="card">
          {renderContent(post.content)}
          <p>Posted on: {new Date(post.createdAt.seconds * 1000).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Feed;
