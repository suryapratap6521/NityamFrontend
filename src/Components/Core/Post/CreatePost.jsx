import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../../services/operations/postApi";
import {
  Card,
  Button,
  CircularProgress,
  Snackbar,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Home, AddPhotoAlternate } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import toast from "react-hot-toast";
import Loader from "../../Common/Loader";
const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const { user } = useSelector((state) => state.profile);

  const [form, setForm] = useState({
    title: "",
    postImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prevState) => ({
      ...prevState,
      postImage: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Creating Your Post...")

    const { title, postImage } = form;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("postImage", postImage);
      console.log(formData);
      await createPost(formData, token);
      setLoading(false);

      toast.success("SuccessFully created the post");
      navigate('/');
    } catch (error) {
      setLoading(false);
      console.log("Error creating post:", error);
    }
    toast.dismiss(toastId);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "16vh" }}
    >
      <Grid item xs={12} md={7.3}>
        <Card
          sx={{
            p: 1,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            mr: 9,
          }}
        >
          {/* <Typography variant="h5" gutterBottom style={{ flex: '1' }}>Create Post</Typography> */}
          <form onSubmit={handleSubmit} style={{ flex: "1" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={user.image} style={{ width: "45px", height: "45px", borderRadius: "50px", marginRight: "10px" }}></img>
              <input
                type="text"
                name="title"
                placeholder="What is in Your Mind Neighbour?"
                value={form.title}
                onChange={handleChange}
                style={{
                  width: "10vh",
                  marginBottom: 10,
                  padding: "12px 15px",
                  boxSizing: "border-box",
                  flex: "1",
                  borderRadius: "20px",
                  border: "2px solid #ccc",
                  outline: "none",
                  fontSize: "16px",
                  transition: "border-color 0.2s",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#f9f9f9",

                }}
              />
              <label htmlFor="upload-image">
                <IconButton component="span" >
                  <AddPhotoAlternate fontSize="large" />
                </IconButton>
              </label>
              <input
                type="file"
                name="postImage"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="upload-image"
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  marginLeft: 4,
                  borderRadius: "50px",
                }}
              >
                {loading ? <Loader /> : <SendIcon />}
              </Button>
            </div>

          </form>
        </Card>
      </Grid>
      {/* <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={() => setOpenToast(false)}
        message="Successfully created the post"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setOpenToast(false)}
          >
            <Home fontSize="small" />
          </IconButton>
        }
      /> */}
    </Grid>
  );
};

export default CreatePost;
