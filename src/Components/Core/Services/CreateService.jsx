import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createService } from '../../../services/operations/serviceApi';
import Uploader from '../../Common/Uploader';
import { TextField, Button, Box, Typography, Container, Grid, Paper } from '@mui/material';

const CreateService = () => {
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    price: '',
    phoneNumber: '',
    profession: '',
    address: '',
    serviceImage: null,
  });

  const [uploadedImage, setUploadedImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleImageUpload = (file) => {
    if (file) {
      setUploadedImage(file);
      setForm(prevForm => ({ ...prevForm, serviceImage: file }));
    } else {
      setUploadedImage(null);
      setForm(prevForm => ({ ...prevForm, serviceImage: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      if (uploadedImage) {
        formData.append('serviceImage', uploadedImage);
      }

      await createService(formData, token);
      toast.success('Service created successfully!');
      navigate('/dashboard/services');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create service. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create a New Service
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Uploader onImageUpload={handleImageUpload} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (₹)"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Profession"
                name="profession"
                value={form.profession}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.5, fontSize: '1rem' }}
          >
            Create Service
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateService;
