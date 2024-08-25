// Modal.js
import React from 'react';
import '../App.css';

const Modal = ({ show, handleClose, handleSave }) => {
  const [inputValue, setInputValue] = React.useState('');

  if (!show) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>×</span>
        <h2>Add Advert</h2>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter advert details"
          rows="4"
          cols="50"
        />
        <br />
        <button onClick={() => handleSave(inputValue)}>Save</button>
      </div>
    </div>
  );
};

export default Modal;
