import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay-Madu"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content-Madu confirm-modal-Madu">
        <div className="confirm-header-Madu">
          <div className={`confirm-icon-Madu ${type}`}>
            {type === 'danger' && '⚠️'}
            {type === 'warning' && '⚠️'}
            {type === 'info' && 'ℹ️'}
          </div>
          <h3 className="confirm-title-Madu">{title}</h3>
        </div>

        <div className="confirm-body-Madu">
          <p className="confirm-message-Madu">{message}</p>
        </div>

        <div className="confirm-actions-Madu">
          <button
            className="btn-Madu btn-secondary-Madu"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className={`btn-Madu ${type === 'danger' ? 'btn-danger-Madu' : 'btn-primary-Madu'}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;