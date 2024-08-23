import React, { useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import BlogList from './components/BlogList';
import AuthForm from './components/AuthForm';
import PrivateRoute from './components/PrivateRoute';
import Feed from './components/Feed'; // Import the Feed component
import './App.css';

const App = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleStartBlog = () => {
    navigate('/create-post');
  };

  const handleEditPost = () => {
    navigate('/edit-post');
  };

  const handleViewPosts = () => {
    navigate('/blog-list');
  };

  const handleLogin = () => {
    setShowAuthForm(true);
  };

  return (
    <div className="App">
      <Header onLogin={handleLogin} />
      {location.pathname !== '/create-post' && location.pathname !== '/blog-list' && (
        <div className='blogButton'>
          <button className='startBlogButton' onClick={handleStartBlog}>Create Post</button>
          <button className='viewPostsButton' onClick={handleViewPosts}>View Posts</button>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Feed />} /> {/* Add the Feed route */}
        <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
        <Route path="/edit-post/:postNumber" element={<PrivateRoute><EditPost /></PrivateRoute>} />
        <Route path="/blog-list" element={<PrivateRoute><BlogList /></PrivateRoute>} />
        <Route path="/auth" element={<AuthForm />} />
      </Routes>
      {showAuthForm && <AuthForm />}
    </div>
  );
};

export default App;
