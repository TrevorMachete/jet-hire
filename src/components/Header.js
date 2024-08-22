// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Header = ({ onLogin }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        }
      } else {
        setUsername('');
      }
    });

    return () => unregisterAuthObserver();
  }, []);

  const handleLogin = () => {
    if (user) {
      signOut(auth);
    } else {
      onLogin();
    }
  };

  return (
    <header className="header">
      <h2>Superblisher</h2>
      <button className="login-button" onClick={handleLogin}>
        {user ? username : 'Log In'}
      </button>
    </header>
  );
};

export default Header;

