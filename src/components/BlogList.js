import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore'; // Added getDoc and updateDoc
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function getCurrentUserId() {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  return currentUser ? currentUser.uid : null;
}

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = [];
        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          if (postData.posts) {
            postData.posts.forEach(post => {
              if (post.userId === getCurrentUserId()) {
                fetchedPosts.push({ postNumber: doc.id, ...post });
              }
            });
          }
        });
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (postNumber) => {
    try {
      console.log('Deleting post with postNumber:', postNumber); // Log the postNumber being deleted
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const postDocRef = doc(db, 'posts', user.uid);
        const postDoc = await getDoc(postDocRef);
        if (postDoc.exists()) {
          const updatedPosts = postDoc.data().posts.filter(p => p.postNumber !== postNumber);
          await updateDoc(postDocRef, { posts: updatedPosts });
          console.log('Post deleted successfully'); // Log success message
          setPosts(posts.filter(post => post.postNumber !== postNumber));
        } else {
          console.error('Document does not exist');
        }
      } else {
        console.error('User is not authenticated');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = (postNumber) => {
    navigate(`/edit-post/${postNumber}`);
  };

  return (
    <div>
      <h2>Blog Posts</h2>
      <ul className="blog-list">
        {posts.map((post) => (
          <li key={post.postNumber} className="blog-item">
            {post.media && <img src={post.media} alt={post.title} className="blog-image" />}
            <div className="blog-details">
              <h6>{post.title}</h6>
              <p className="post-date">{post.createdAt.toDate().toString()}</p> {/* Add CSS class for the date */}
            </div>
            <button onClick={() => handleEdit(post.postNumber)}>Edit</button>
            <button onClick={() => handleDelete(post.postNumber)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
