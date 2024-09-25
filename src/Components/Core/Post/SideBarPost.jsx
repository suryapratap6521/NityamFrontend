import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../../services/operations/postApi";
import { Card, Button, Typography, Grid, TextField, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Send as SendIcon } from "@mui/icons-material";
import toast from 'react-hot-toast';
import Sidebar from "../Dashboard/Sidebar";
import Loader from "../../Common/Loader";

const Upload = ({ label, name, onUpload, onCancel, accept }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    onUpload(files); // Call the onUpload function with the selected files
  };

  const handleCancel = (file) => {
    const updatedFiles = selectedFiles.filter(f => f !== file);
    setSelectedFiles(updatedFiles);
    onCancel(file); // Call the onCancel function to remove the file
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <label htmlFor={name} style={{ cursor: 'pointer', color: '#3f51b5' }}>
        {label}
      </label>
      <input
        type="file"
        id={name}
        name={name}
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        multiple
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {selectedFiles.map((file, index) => (
          <Box key={index} sx={{ position: 'relative' }}>
            <img
              src={URL.createObjectURL(file)}
              alt="Selected"
              style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: '8px' }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={() => handleCancel(file)}
              sx={{ position: 'absolute', top: 0, right: 0, color: '#f44336' }}
            >
              X
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const SideBarPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    postFiles: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpload = (files) => {
    setForm((prevState) => ({
      ...prevState,
      postFiles: files,
    }));
  };

  const handleCancel = (file) => {
    setForm((prevState) => ({
      ...prevState,
      postFiles: prevState.postFiles.filter(f => f !== file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Creating Your Post...");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      form.postFiles.forEach(file => {
        formData.append("postFiles", file);
      });

      await createPost(formData, token);

      setLoading(false);
      toast.success("Successfully created the post");
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      console.log("Error creating post:", error);
      toast.error("Failed to create post");
    }
    toast.dismiss(toastId);
  };

  return (
    <div>
      <Sidebar />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              textAlign: "center",
              maxWidth: 400,
              mx: "auto",
              borderRadius: 8,
              boxShadow: 3,
            }}
          >
            <Typography variant="h5" gutterBottom>Create Post</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="What's on your mind?"
                name="title"
                value={form.title}
                onChange={handleChange}
                style={{ marginBottom: '16px' }}
              />
              <Upload
                label="Upload Images or Videos"
                name="postFiles"
                onUpload={handleUpload}
                onCancel={handleCancel} // Pass the onCancel function to the Upload component
                accept="image/*,video/*"
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  borderRadius: "50px",
                  marginTop: '16px',
                }}
              >
                {loading ? <Loader /> : <SendIcon />}
              </Button>
            </form>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default SideBarPost;
