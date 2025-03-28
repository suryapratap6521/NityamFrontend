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
    <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 mt-6">
      <div className='mb-6 text-center'>
        <h1 className="md:text-3xl text-xl text-center font-semibold mb-1 text-[#8E2DE2]">
          Create New Service
        </h1>
        <p className="text-gray-400 leading-4 text-sm">
          Start offering your expertise by creating a new service.
        </p></div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Uploader onImageUpload={handleImageUpload} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-200"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-200"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-200"
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-200"
            required
          />
          <input
            type="text"
            name="profession"
            placeholder="Profession"
            value={form.profession}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-200"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-200"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#8E2DE2] text-white p-3 rounded-md hover:bg-[#8E2DE2] transition"
        >
          Create Service
        </button>
      </form>
    </div>
  );
};

export default CreateService;