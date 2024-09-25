import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { styled } from '@mui/system';
import { updateProfile } from '../../../services/operations/settingsApi';
import Iconbtn from '../../Common/Iconbtn';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const ProfileForm = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    dispatch(updateProfile(token, data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        my={4}
        p={4}
        bgcolor="background.paper"
        borderRadius={2}
        boxShadow={3}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <Typography variant="h6">Profile Information</Typography>
        
        <Box display="flex" flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
          <FormControl fullWidth error={Boolean(errors.firstName)}>
            <TextField
              label="First Name"
              variant="outlined"
              {...register("firstName", { required: "Please enter your first name." })}
              defaultValue={user?.firstName}
              helperText={errors.firstName && errors.firstName.message}
            />
          </FormControl>

          <FormControl fullWidth error={Boolean(errors.lastName)}>
            <TextField
              label="Last Name"
              variant="outlined"
              {...register("lastName", { required: "Please enter your last name." })}
              defaultValue={user?.lastName}
              helperText={errors.lastName && errors.lastName.message}
            />
          </FormControl>
        </Box>

        <Box display="flex" flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
          <FormControl fullWidth error={Boolean(errors.dateOfBirth)}>
            <TextField
              label="Date of Birth"
              type="date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              {...register("dateOfBirth", {
                required: "Please enter your Date of Birth.",
                max: {
                  value: new Date().toISOString().split("T")[0],
                  message: "Date of Birth cannot be in the future.",
                },
              })}
              defaultValue={user?.additionalDetails?.dateOfBirth}
              helperText={errors.dateOfBirth && errors.dateOfBirth.message}
            />
          </FormControl>

          <FormControl fullWidth error={Boolean(errors.gender)}>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              label="Gender"
              {...register("gender", { required: "Please select your gender." })}
              defaultValue={user?.additionalDetails?.gender}
            >
              {["Male", "Female", "Other"].map((ele, i) => (
                <MenuItem key={i} value={ele}>
                  {ele}
                </MenuItem>
              ))}
            </Select>
            {errors.gender && (
              <FormHelperText>{errors.gender.message}</FormHelperText>
            )}
          </FormControl>
        </Box>

        <Box display="flex" flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
          <FormControl fullWidth error={Boolean(errors.contactNumber)}>
            <TextField
              label="Contact Number"
              type="tel"
              variant="outlined"
              {...register("contactNumber", {
                required: "Please enter your Contact Number.",
                maxLength: { value: 12, message: "Invalid Contact Number" },
                minLength: { value: 10, message: "Invalid Contact Number" },
              })}
              defaultValue={user?.additionalDetails?.contactNumber}
              helperText={errors.contactNumber && errors.contactNumber.message}
            />
          </FormControl>

          <FormControl fullWidth error={Boolean(errors.about)}>
            <TextField
              label="About"
              variant="outlined"
              {...register("about", { required: "Please enter your About." })}
              defaultValue={user?.additionalDetails?.about}
              helperText={errors.about && errors.about.message}
            />
          </FormControl>
        </Box>
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
        <Button
          onClick={() => {
            navigate("/dashboard/my-profile");
          }}
          variant="contained"
          color="secondary"
        >
          Cancel
        </Button>
        <StyledButton type="submit">
          Save
        </StyledButton>
      </Box>
    </form>
  );
};

export default ProfileForm;
