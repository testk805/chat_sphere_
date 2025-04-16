import React from "react";

export default function SuccessPop({ message, onClose }) {
  const closePopup = () => {
    if (onClose) {
      onClose(); // Call the parent-provided function to close the popup
    }
  };

  return (
    <div className="successpop-up">
      <div className="success-content">
        <span className="success-message">{message}</span>
        <button className="close-btn" onClick={closePopup}>
          &times;
        </button>
      </div>
    </div>
  );
}
