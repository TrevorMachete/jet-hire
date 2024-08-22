// src/components/AuthForm.js
import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    if (isRegistering) {
      // Register new user
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          username: username,
          email: email,
        });

        alert('Registration successful!');
      } catch (error) {
        console.error('Error registering user:', error);
        alert('Error registering user:', error.message);
      }
    } else {
      // Log in existing user
      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful!');
      } catch (error) {
        console.error('Error logging in user:', error);
        alert('Error logging in user:', error.message);
      }
    }
  };

  if (user) {
    return null; // Hide the form if a user is logged in
  }

  return (
    <div className="auth-form">
      <h2>{isRegistering ? 'Register' : 'Log In'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isRegistering ? 'Register' : 'Log In'}</button>
      </form>
      <button className="toggle-button" onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Already have an account? Log In' : 'Need an account? Register'}
      </button>
    </div>
  );
};

export default AuthForm;