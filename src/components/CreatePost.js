// src/components/CreatePost.js
import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db, storage } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactMarkdown from 'react-markdown';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'react-image-crop/dist/ReactCrop.css';
import '../App.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null); // State to handle media
  const [isMarkdown, setIsMarkdown] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userDocRef = doc(db, 'posts', user.uid);
      const userDoc = await getDoc(userDocRef);

      let postNumber = 1;
      if (userDoc.exists()) {
        const userData = userDoc.data();
        postNumber = userData.posts.length + 1;
      } else {
        await setDoc(userDocRef, { posts: [] });
      }

      let mediaUrl = null;
      if (media) {
        const mediaRef = ref(storage, `media/${media.name}`);
        await uploadBytes(mediaRef, media);
        mediaUrl = await getDownloadURL(mediaRef);
      }

      const newPost = {
        postNumber,
        title,
        content,
        media: mediaUrl,
        createdAt: new Date(),
      };

      await updateDoc(userDocRef, {
        posts: arrayUnion(newPost),
      });

      setTitle('');
      setContent('');
      setMedia(null);
    } else {
      alert('You need to be logged in to create a post.');
    }
  };

  const handleMediaChange = (e) => {
    setMedia(e.target.files[0]);
  };

  // Custom Upload Adapter for Firebase Storage
  class MyUploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }

    upload() {
      return this.loader.file.then(
        (file) =>
          new Promise((resolve, reject) => {
            const storageRef = ref(storage, `images/${file.name}`);
            uploadBytes(storageRef, file)
              .then((snapshot) => getDownloadURL(snapshot.ref))
              .then((url) => {
                resolve({
                  default: url,
                });
              })
              .catch((error) => {
                reject(error);
              });
          })
      );
    }

    abort() {
      // Handle abort if necessary
    }
  }

  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
  }

  return (
    <form onSubmit={handleSubmit}>

      <div>
        <label>
          <input
            type="checkbox"
            checked={isMarkdown}
            onChange={() => setIsMarkdown(!isMarkdown)}
          />
          Use Markdown
        </label>
      </div>
      {isMarkdown ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />
      ) : (
        <CKEditor
          editor={ClassicEditor}
          data={content}
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
          config={{
            extraPlugins: [MyCustomUploadAdapterPlugin],
            image: {
              toolbar: [
                'imageTextAlternative',
                'imageStyle:full',
                'imageStyle:side',
                'resizeImage:50',
                'resizeImage:75',
                'resizeImage:original',
                'cropImage'
              ]
            }
          }}
        />
      )}
      
      <button type="submit">Create</button>
      {isMarkdown && (
        <div>
          <h3>Preview</h3>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </form>
  );
};

export default CreatePost;
