import React from 'react';
import { Box, Typography, Button } from "@mui/material";

const VerificationCard = ({ onComplete }) => (
  <Box sx={{ textAlign: 'center', py: 4 }}>
    <Typography variant="h6" gutterBottom>
      Your account is not verified
    </Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>
      Verify via Aadhaar or Postal Card to unlock all features.
    </Typography>
    <Button variant="contained" onClick={onComplete}>
      Complete Verification
    </Button>
  </Box>
);

export default VerificationCard;
