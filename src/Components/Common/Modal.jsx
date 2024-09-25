// ReusableModal.js
import React from 'react';
import { IconButton } from "@mui/material";
import { FaTimes } from "react-icons/fa";

const Modal = ({ show, onClose, children, title }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white w-80 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-medium">{title}</h2>
          <IconButton onClick={onClose}>
            <FaTimes className="text-2xl" />
          </IconButton>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
