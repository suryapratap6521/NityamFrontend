import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import { SetSignUpData } from '../../../slices/authSlice';
import { sendotp,googleDetails } from '../../../services/operations/authApi';
import Loader from '../../Common/Loader'; // Import Loader component


function Community() {
  const dispatch = useDispatch();
  const { signUpData, loading } = useSelector((state) => state.auth); // Add loading state
  
  const navigate = useNavigate();

  const postalCost = signUpData?.formData?.postalCost;
  console.log(SetSignUpData)
  console.log(signUpData);
  console.log(signUpData?.postalCost)
  const [communityData, setCommunityData] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');

  useEffect(() => {
    if (!signUpData) {
      navigate('/signup');
    }
  }, [signUpData, navigate]);

  useEffect(() => {
    console.log(postalCost);
    if (postalCost) {
      console.log(postalCost)
      axios.get(`https://api.postalpincode.in/pincode/${postalCost}`)
        .then(response => {
          console.log(response);
          setCommunityData(response.data[0]?.PostOffice || []);
        })
        .catch(error => {
          console.error('Error fetching community data:', error);
        });
    }
  }, [postalCost]);

  const handleSelectChange = (event) => {
    setSelectedCommunity(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = { ...signUpData.formData, community: selectedCommunity };
    
    if (updatedFormData?.firstName) {
      dispatch(SetSignUpData({ formData: updatedFormData }));
      dispatch(sendotp(signUpData.formData.email, navigate));
    }
    else{
      const {city,state,postalCost,phoneNumber,community,profession,hourlyCharge}=updatedFormData;
     dispatch(googleDetails(city,state,postalCost,phoneNumber,community,profession,hourlyCharge,navigate))
    }
   
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {loading ? ( // Conditionally render Loader if loading is true
        <Loader />
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            {communityData.length > 0 && (
              <div>
                <select
                  value={selectedCommunity}
                  onChange={handleSelectChange}
                  style={{
                    width: '23rem',
                    height: '3rem',
                    borderRadius: '20px',
                    border: '2px solid #ccc',
                    padding: '0.5rem',
                    fontSize: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Select a Community</option>
                  {communityData.map((community, index) => (
                    <option key={index} value={community.Name}>
                      {community.Name}
                    </option>
                  ))}
                </select>
                <Button type='submit' variant="contained" color="success" sx={{ width: "6rem", borderRadius:"20px",ml:2,height:"3rem" }}>Continue</Button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
  
}

export default Community;
