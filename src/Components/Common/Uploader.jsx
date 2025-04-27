import React, { useState } from 'react';
import './uploader.css';
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import { AiFillFileImage } from 'react-icons/ai';

function Uploader({ onImageUpload }) {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("No selected file");

  const handleFileChange = ({ target: { files } }) => {
    if (files && files[0]) {
      setFileName(files[0].name);
      const imageUrl = URL.createObjectURL(files[0]);
      setImage(imageUrl);
      onImageUpload(files[0]); // Pass the file to the parent component
    }
  };

  return (
    <main className="uploader-container">
      <form
        onClick={() => document.querySelector(".input-field").click()}
        className="upload-form"
      >
        <input
          type="file"
          accept="image/*"
          className="input-field"
          hidden
          onChange={handleFileChange}
        />
        {image ? (
          <img src={image} width={150} height={150} alt={fileName} className="uploaded-image" />
        ) : (
          <div className="upload-placeholder">
            <MdCloudUpload color="#8E2DE2" size={60} />
            <p>Browse Files to upload</p>
          </div>
        )}
      </form>
      <section className="uploaded-row">
        <AiFillFileImage color="#8E2DE2" />
        <span className="upload-content">
          {fileName}
          {image && (
            <MdDelete
              className="delete-icon"
              onClick={() => {
                setFileName("No selected file");
                setImage(null);
                onImageUpload(null); // Clear the image in the parent component
              }}
            />
          )}
        </span>
      </section>
    </main>
  );
}

export default Uploader;
