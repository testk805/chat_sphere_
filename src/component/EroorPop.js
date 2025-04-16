import React from "react";

export default function EroorPop({ message, onClose }) {
  const closePopup = () => {
    if (onClose) {
      onClose(); // Call the parent-provided function to close the popup
    }
  };

  return (
    <div className="error-pop-up">
      <div className="error-content">
        <span className="error-message">{message}</span>
        <button className="close-btn" onClick={closePopup}>
          &times;
        </button>
      </div>
    </div>
  );
}
