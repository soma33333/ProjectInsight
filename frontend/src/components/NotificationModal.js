import React from "react";
import "./css/NotificationModal.css"
function NotificationModal({ message, onClose }) {
  return (
    <div className="notification-modal">
      <div className="notification-content">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

export default NotificationModal;
