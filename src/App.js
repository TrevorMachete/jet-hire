// src/App.js
import React, { useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import CreatePost from './components/CreatePost';
import AuthForm from './components/AuthForm';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

const App = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleStartBlog = () => {
    navigate('/create-post');
  };

  const handleLogin = () => {
    setShowAuthForm(true);
  };

  return (
    <div className="App">
      <Header onLogin={handleLogin} />
      {location.pathname !== '/create-post' && (
        <div className='blogButton'>
          <button className='startBlogButton' onClick={handleStartBlog}>Create Post</button>
        </div>
      )}
      <Routes>
        <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
        <Route path="/auth" element={<AuthForm />} />
      </Routes>
      {showAuthForm && <AuthForm />}
    </div>
  );
};

export default App;

