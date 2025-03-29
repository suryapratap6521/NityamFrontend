import { Avatar, Box, Button, Typography, useMediaQuery, Card, CardContent, Stack, IconButton, TextField } from "@mui/material";
import { Edit, Language, CalendarToday, Phone, Email, Public, Groups } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formattedDate } from "../../../utils/dateFormatter";
import styled from "@emotion/styled";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { updateDisplayPicture, updateProfile } from "../../../services/operations/settingsApi";

const ProfileContainer = styled(Box)(({ theme }) => ({
  maxWidth: 1260,
  margin: '80px auto 0',
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  marginBottom: theme.spacing(3),
  '&:hover': {
    boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
  },
}));

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(user?.additionalDetails?.about || '');
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(user?.image || '');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewSource(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      let updatesMade = false;
      const updates = {};
  
      // 1. Handle Image Update
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("displayPicture", imageFile);
        await dispatch(updateDisplayPicture(token, imageFormData));
        updatesMade = true;
      }
  
      // 2. Handle Bio Update
      if (about !== user?.additionalDetails?.about) {
        updates.additionalDetails = {
          ...user.additionalDetails,
          about: about,
        };
        await dispatch(updateProfile(token, updates));
        updatesMade = true;
      }
  
      // 3. Handle State Updates
      if (updatesMade) {
        setIsEditing(false);
        setImageFile(null);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save changes");
      
      // Reset image preview on error
      if (imageFile) {
        setPreviewSource(user?.image);
        setImageFile(null);
      }
    }
  };
  return (
    <ProfileContainer>
      <SectionCard>
        <CardContent sx={{ position: 'relative', p: 4 }}>
          <Box sx={{
            display: 'flex',
            flexDirection: isSmallScreen ? 'column' : 'row',
            alignItems: 'center',
            gap: 4,
          }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar 
                src={previewSource} 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  border: '3px solid #fff',
                  boxShadow: 3,
                }}
              />
              {isEditing && (
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  <Edit fontSize="small" />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </IconButton>
              )}
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight="700" gutterBottom>
                {`${user?.firstName} ${user?.lastName}`}
              </Typography>
              
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Typography variant="body1" color="text.secondary">
                  <Email fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  {user?.email}
                </Typography>
                {user?.additionalDetails?.contactNumber && (
                  <Typography variant="body1" color="text.secondary">
                    <Phone fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {user.additionalDetails.contactNumber}
                  </Typography>
                )}
              </Stack>
            </Box>

            <IconButton
              onClick={() => setIsEditing(!isEditing)}
              sx={{
                position: isSmallScreen ? 'relative' : 'absolute',
                top: isSmallScreen ? 0 : 24,
                right: isSmallScreen ? 0 : 24,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <Edit />
            </IconButton>
          </Box>
        </CardContent>
      </SectionCard>

      <SectionCard>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Language fontSize="small" /> About
          </Typography>
          
          {isEditing ? (
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          ) : (
            <Typography variant="body1" paragraph sx={{ 
              color: about ? 'text.primary' : 'text.secondary',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
            }}>
              {about || 'No bio added yet...'}
            </Typography>
          )}
        </CardContent>
      </SectionCard>

      <SectionCard>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
            Personal Details
          </Typography>
          
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3,
          }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CalendarToday fontSize="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                <Typography variant="body1" fontWeight="500">
                  {formattedDate(user?.additionalDetails?.dateOfBirth) || 'Not specified'}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Phone fontSize="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Contact Number</Typography>
                <Typography variant="body1" fontWeight="500">
                  {user?.additionalDetails?.contactNumber || 'Not specified'}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Public fontSize="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Gender</Typography>
                <Typography variant="body1" fontWeight="500">
                  {user?.additionalDetails?.gender || 'Not specified'}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Groups fontSize="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Community</Typography>
                <Typography variant="body1" fontWeight="500">
                  {user?.community || 'No community'}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </SectionCard>

      {isEditing && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button variant="outlined" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      )}
    </ProfileContainer>
  );
}