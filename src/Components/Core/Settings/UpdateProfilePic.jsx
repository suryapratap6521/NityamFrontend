import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { FiUpload } from "react-icons/fi";
import { updateDisplayPicture } from "../../../services/operations/settingsApi";
import {
  Box,
  Button,
  CircularProgress,
  Avatar,
  Typography,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const UpdateProfilePic = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);

  const fileInputRef = useRef(null);
  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      previewFile(file);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleFileUpload = () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("displayPicture", imageFile);
      dispatch(updateDisplayPicture(token, formData)).then(() => {
        setLoading(false);
      });
    } catch (error) {
      console.error("ERROR MESSAGE - ", error.message);
    }
  };

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile);
    }
  }, [imageFile]);

  return (
    <>
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      bgcolor="background.paper"
      borderRadius={2}
      boxShadow={3}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          src={previewSource || user?.image}
          alt={`profile-${user?.firstName}`}
          sx={{ width: 78, height: 78 }}
        />
        <Box>
          <Typography variant="h6">Change Profile Picture</Typography>
          <Box display="flex" gap={2} mt={1}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/png, image/gif, image/jpeg"
            />
            <StyledButton
              onClick={handleClick}
              disabled={loading}
              variant="contained"
            >
              Select
            </StyledButton>
            <StyledButton
              onClick={handleFileUpload}
              disabled={loading}
              variant="contained"
              endIcon={!loading && <FiUpload />}
            >
              {loading ? <CircularProgress size={24} /> : "Upload"}
            </StyledButton>
          </Box>
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default UpdateProfilePic;
