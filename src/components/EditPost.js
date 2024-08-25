import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase'; // Ensure storage is imported from your firebase configuration
import { getAuth } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary functions from firebase/storage
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '../App.css';

const EditPost = () => {
  const { postNumber } = useParams(); // Use postNumber from URL
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        console.log('Fetching post for user:', user.uid); // Log user ID
        console.log('Post number:', postNumber); // Log post number

        const postDocRef = doc(db, 'posts', user.uid);
        const postDoc = await getDoc(postDocRef);
        if (postDoc.exists()) {
          console.log('Document data:', postDoc.data()); // Log document data

          const postData = postDoc.data().posts.find(p => p.postNumber === parseInt(postNumber));
          if (postData) {
            console.log('Post data:', postData); // Log post data

            setPost(postData);
            setTitle(postData.title);
            setContent(postData.content);
            setMedia(postData.media);
          } else {
            console.error('Post not found');
          }
        } else {
          console.error('Document does not exist');
        }
      }
    };
    fetchPost();
  }, [postNumber]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      console.log('User authenticated:', user.uid); // Log user ID
      const postDocRef = doc(db, 'posts', user.uid);
      const postDoc = await getDoc(postDocRef);
      if (postDoc.exists()) {
        console.log('Document data before update:', postDoc.data()); // Log document data before update

        const updatedPosts = postDoc.data().posts.map(p =>
          p.postNumber === parseInt(postNumber) ? { ...p, title, content, media } : p
        );
        console.log('Updated posts:', updatedPosts); // Log updated posts
        await updateDoc(postDocRef, { posts: updatedPosts });
        console.log('Document updated successfully'); // Log success message
        navigate('/blog-list');
      } else {
        console.error('Document does not exist');
      }
    } else {
      console.error('User is not authenticated');
    }
  };

  // Custom Upload Adapter for Firebase Storage
  class MyUploadAdapter {
    constructor(loader, onUploadComplete) {
      this.loader = loader;
      this.onUploadComplete = onUploadComplete;
    }

    upload() {
      return this.loader.file.then(
        (file) =>
          new Promise((resolve, reject) => {
            const storageRef = ref(storage, `images/${file.name}`);
            uploadBytes(storageRef, file)
              .then((snapshot) => getDownloadURL(snapshot.ref))
              .then((url) => {
                console.log('Upload Adapter URL:', url); // Debugging log
                this.onUploadComplete(url); // Call the onUploadComplete function with the URL
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
      return new MyUploadAdapter(loader, (url) => setMedia(url));
    };
  }

  return (
    <div className="edit-window">
      {post ? (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
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
          <button type="submit">Update</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditPost;
