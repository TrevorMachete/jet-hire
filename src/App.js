// App.js
import React, { useState, useContext } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from './Context';
import Header from './components/Header';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import BlogList from './components/BlogList';
import AuthForm from './components/AuthForm';
import PrivateRoute from './components/PrivateRoute';
import Feed from './components/Feed';
import Modal from './components/Modal';
import './App.css';

const App = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { setAdvertDetails } = useContext(AppContext);
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

  const handleAddAdvert = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveAdvert = (details) => {
    setAdvertDetails(details);
    setShowModal(false);
  };

  return (
    <div className="App">
      <div className="header">
        <Header onLogin={handleLogin} />
      </div>
      <div className="content">
        <div className="left-section">
          <button className="navButton" onClick={() => navigate('/')}>Home</button>
          <button className="navButton" onClick={handleStartBlog}>Create Post</button>
          <button className="navButton" onClick={handleViewPosts}>View Posts</button>
          <button className="navButton" onClick={handleAddAdvert}>Add advert</button>
        </div>
        <div className="right-section">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
            <Route path="/edit-post/:postNumber" element={<PrivateRoute><EditPost /></PrivateRoute>} />
            <Route path="/blog-list" element={<PrivateRoute><BlogList /></PrivateRoute>} />
            <Route path="/auth" element={<AuthForm />} />
          </Routes>
          {showAuthForm && <AuthForm />}
        </div>
      </div>
      {location.pathname === '/' && (
        <div className='blogButton'>
          <button className="startBlogButton" onClick={handleStartBlog}>Start Blogging</button>
        </div>
      )}
      <Modal show={showModal} handleClose={handleCloseModal} handleSave={handleSaveAdvert} />
    </div>
  );
};

export default App;
