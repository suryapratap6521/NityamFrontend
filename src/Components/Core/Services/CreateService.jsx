import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createService } from "../../../services/operations/serviceApi";
import Uploader from "../../Common/Uploader";
import {
  TextField,
  Button,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Slider,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Dummy endpoints - replace with your actual endpoints
import { locationEndpoints } from "../../../services/apis";

const CreateService = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  // Predefined list of professions
  const professionOptions = [
    "Plumber",
    "Electrician",
    "Carpenter",
    "Mechanic",
    "Other",
  ];

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    price: 50, // default price value
    phoneNumber: "",
    // We'll use "selectedProfession" for the dropdown,
    // and if "Other" is chosen, then customProfession is used.
    selectedProfession: "",
    customProfession: "",
    address: "",
    serviceImage: null,
  });

  const [uploadedImage, setUploadedImage] = useState(null);

  // States for location suggestions
  const [accessToken, setAccessToken] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Fetch access token for location suggestions on mount
  useEffect(() => {
    const fetchAccessToken = async () => {
      toast.dismiss();
      try {
        const response = await axios.post(locationEndpoints.ACCESS_TOKEN);
        setAccessToken(response.data.access_token);
      } catch (error) {
        console.error("Error fetching access token:", error);
        toast.error("Failed to fetch access token.");
      }
    };
    fetchAccessToken();
  }, []);

  // Handle input changes for text fields (excluding address)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle slider changes for price
  const handlePriceChange = (event, newValue) => {
    setForm((prev) => ({ ...prev, price: newValue }));
  };

  // Handle image upload from Uploader component
  const handleImageUpload = (file) => {
    if (file) {
      setUploadedImage(file);
      setForm((prev) => ({ ...prev, serviceImage: file }));
    } else {
      setUploadedImage(null);
      setForm((prev) => ({ ...prev, serviceImage: null }));
    }
  };

  // Handle changes for the Address field with suggestions
  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setForm((prev) => ({ ...prev, address: newAddress }));

    // Debounce API call for suggestions
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        fetchSuggestions(newAddress);
      }, 500)
    );
  };

  // Fetch suggestions for address using the provided API endpoint
  const fetchSuggestions = async (query) => {
    if (!query) return setSuggestions([]);
    try {
      const response = await axios.post(locationEndpoints.GET_AREAS, {
        address: query,
        access_token: accessToken,
      });
      setSuggestions(response.data.copResults || []);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  // When a suggestion is clicked, set it as the address and clear suggestions
  const handleSuggestionClick = (formattedAddress) => {
    setForm((prev) => ({ ...prev, address: formattedAddress }));
    setSuggestions([]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      // Append all fields
      for (const key in form) {
        // For profession, if "Other" is selected, use customProfession
        if (key === "selectedProfession") {
          const profession =
            form.selectedProfession === "Other"
              ? form.customProfession
              : form.selectedProfession;
          formData.append("profession", profession);
        } else if (key !== "customProfession") {
          formData.append(key, form[key]);
        }
      }
      if (uploadedImage) {
        formData.append("serviceImage", uploadedImage);
      }
      await createService(formData, token);
      toast.success("Service created successfully!");
      onClose();
      navigate("/dashboard/services");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create service. Please try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, fontSize: "1.5rem" }}>
        Create a New Service
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Uploader onImageUpload={handleImageUpload} />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Price (₹)
              </Typography>
              <Slider
                value={form.price}
                onChange={handlePriceChange}
                min={0}
                max={10000}
                step={50}
                valueLabelDisplay="auto"
              />
              <Typography variant="body2" color="text.secondary">
                Selected Price: ₹{form.price}
              </Typography>
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
              />
            </Grid>

            {/* Profession Dropdown */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="profession-label">Profession</InputLabel>
                <Select
                  labelId="profession-label"
                  name="selectedProfession"
                  value={form.selectedProfession}
                  label="Profession"
                  onChange={handleChange}
                >
                  {professionOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* If "Other" is selected, show custom profession input */}
            {form.selectedProfession === "Other" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Enter your Profession"
                  name="customProfession"
                  value={form.customProfession}
                  onChange={handleChange}
                  required
                />
              </Grid>
            )}

            {/* Address Field with suggestions */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={form.address}
                onChange={handleAddressChange}
                required
              />
              {suggestions.length > 0 && (
                <Box
                  sx={{
                    mt: 1,
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    maxHeight: 200,
                    overflowY: "auto",
                  }}
                >
                  {suggestions.map((sugg, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 1,
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f0f0f0" },
                      }}
                      onClick={() => handleSuggestionClick(sugg.formattedAddress)}
                    >
                      {sugg.formattedAddress}
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
            Create Service
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateService;
