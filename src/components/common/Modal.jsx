import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, children, error, errorTitle, top }) => {
  if (!isOpen) return null;

  return (
    <div className={top ? 'modal-overlay-top' : 'modal-overlay'}>
      <div className={error ? 'modal-content modal-error' : 'modal-content'}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {error ? (
          <>
            <div className="modal-error-title">
              <span style={{fontSize: '1.5em', marginRight: 8}}>⚠️</span>
              {errorTitle || 'Error'}
            </div>
            <div className="modal-error-message">{error}</div>
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default Modal;