import { 
  Avatar, Box, Button, Typography, useMediaQuery, Card, CardContent, 
  Stack, IconButton, TextField, Fade 
} from "@mui/material";
import { Edit, Language, CalendarToday, Phone, Email, Public, Groups } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formattedDate } from "../../../utils/dateFormatter";
import styled from "@emotion/styled";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { updateDisplayPicture, updateProfile } from "../../../services/operations/settingsApi";

// Styled components for cleaner, LinkedIn-inspired design
const ProfileContainer = styled(Box)(({ theme }) => ({
  maxWidth: 1260,
  margin: '80px auto 0',
  padding: theme.spacing(3),
  backgroundColor: "#f5f5f5",
  borderRadius: 8,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  marginBottom: theme.spacing(3),
  transition: 'box-shadow 0.3s ease-in-out',
  backgroundColor: "#fff",
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

  // Local state for edit mode and fields
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(user?.additionalDetails?.about || '');
  const [dob, setDob] = useState(user?.additionalDetails?.dateOfBirth || '');
  const [gender, setGender] = useState(user?.additionalDetails?.gender || '');
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(user?.image || '');

  // Handle display picture file selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewSource(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Save changes for display picture and profile details
  const handleSave = async () => {
    try {
      let updatesMade = false;
      const updates = {};

      // If image file was changed, update display picture
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("displayPicture", imageFile);
        await dispatch(updateDisplayPicture(token, imageFormData));
        updatesMade = true;
      }

      // Always update bio (about) field if changed
      if (about !== user?.additionalDetails?.about) {
        updates.additionalDetails = { ...updates.additionalDetails, about };
        updatesMade = true;
      }

      // If date of birth or gender were not provided (or need update), include them
      if (!user?.additionalDetails?.dateOfBirth || dob !== user?.additionalDetails?.dateOfBirth) {
        updates.additionalDetails = { ...updates.additionalDetails, dateOfBirth: dob };
        updatesMade = true;
      }
      if (!user?.additionalDetails?.gender || gender !== user?.additionalDetails?.gender) {
        updates.additionalDetails = { ...updates.additionalDetails, gender };
        updatesMade = true;
      }

      if (updatesMade) {
        await dispatch(updateProfile(token, updates));
        toast.success("Profile updated successfully");
      }
      setIsEditing(false);
      setImageFile(null);
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save changes");
      if (imageFile) {
        setPreviewSource(user?.image);
        setImageFile(null);
      }
    }
  };

  return (
    <ProfileContainer>
      {/* Header Section */}
      <SectionCard>
        <CardContent sx={{ position: 'relative', p: 4 }}>
          <Box 
            sx={{
              display: 'flex',
              flexDirection: isSmallScreen ? 'column' : 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
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
                    bottom: -8,
                    right: -8,
                    bgcolor: 'primary.main',
                    color: 'white',
                    border: '2px solid #fff',
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
              <Typography variant="h4" fontWeight="700">
                {`${user?.firstName} ${user?.lastName}`}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {user?.email}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{ mt: 2 }}>
                {user?.additionalDetails?.contactNumber && (
                  <Typography variant="body2" color="text.secondary">
                    <Email fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    {user.additionalDetails.contactNumber}
                  </Typography>
                )}
                {/* Additional primary details can be added here */}
              </Stack>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {isEditing ? (
                <>
                  <Button variant="contained" onClick={handleSave}>
                    Save Changes
                  </Button>
                  <Button variant="outlined" onClick={() => {
                    setIsEditing(false);
                    setAbout(user?.additionalDetails?.about || '');
                    setDob(user?.additionalDetails?.dateOfBirth || '');
                    setGender(user?.additionalDetails?.gender || '');
                    setPreviewSource(user?.image || '');
                    setImageFile(null);
                  }}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  variant="contained" 
                  onClick={() => setIsEditing(true)}
                  startIcon={<Edit />}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </SectionCard>

      {/* About Section */}
      <SectionCard>
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h6" 
            fontWeight="700" 
            gutterBottom 
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Language fontSize="small" /> About
          </Typography>
          <Fade in timeout={500}>
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
              <Typography 
                variant="body1" 
                sx={{ 
                  color: about ? 'text.primary' : 'text.secondary',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}
              >
                {about || 'No bio added yet...'}
              </Typography>
            )}
          </Fade>
        </CardContent>
      </SectionCard>

      {/* Personal Details Section */}
      <SectionCard>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
            Personal Details
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
            }}
          >
            {/* Date of Birth */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CalendarToday fontSize="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                {isEditing && !user?.additionalDetails?.dateOfBirth ? (
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="YYYY-MM-DD"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                ) : (
                  <Typography variant="body1" fontWeight="500">
                    {formattedDate(user?.additionalDetails?.dateOfBirth) || 'Not specified'}
                  </Typography>
                )}
              </Box>
            </Stack>
            {/* Contact Number */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Phone fontSize="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Contact Number</Typography>
                <Typography variant="body1" fontWeight="500">
                  {user?.phoneNumber || 'Not specified'}
                </Typography>
              </Box>
            </Stack>
            {/* Gender */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Public fontSize="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Gender</Typography>
                {isEditing && !user?.additionalDetails?.gender ? (
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  />
                ) : (
                  <Typography variant="body1" fontWeight="500">
                    {user?.additionalDetails?.gender || 'Not specified'}
                  </Typography>
                )}
              </Box>
            </Stack>
            {/* Community */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Groups fontSize="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Community</Typography>
                <Typography variant="body1" fontWeight="500">
                  {user?.communityDetails?.communityName || user.community}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </SectionCard>
    </ProfileContainer>
  );
}
